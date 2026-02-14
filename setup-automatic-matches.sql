-- ============================================
-- SISTEMA AUTOMÁTICO DE MATCHES
-- Ejecuta este script completo en Supabase SQL Editor
-- ============================================

-- PASO 1: Asegurar constraint único en matches (evitar duplicados)
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user_a_id_user_b_id_key;
ALTER TABLE matches ADD CONSTRAINT matches_user_a_id_user_b_id_key UNIQUE (user_a_id, user_b_id);

-- PASO 2: Crear función para verificar y crear matches
CREATE OR REPLACE FUNCTION check_and_create_match(
  p_swiper_id uuid,
  p_swiped_id uuid
)
RETURNS TABLE (
  match_created boolean,
  match_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_match_id uuid;
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_reverse_swipe_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM swipes
    WHERE swiper_id = p_swiped_id
      AND swiped_id = p_swiper_id
      AND direction = 'like'
  ) INTO v_reverse_swipe_exists;

  IF v_reverse_swipe_exists THEN
    IF p_swiper_id < p_swiped_id THEN
      v_user_a_id := p_swiper_id;
      v_user_b_id := p_swiped_id;
    ELSE
      v_user_a_id := p_swiped_id;
      v_user_b_id := p_swiper_id;
    END IF;

    INSERT INTO matches (user_a_id, user_b_id, is_active)
    VALUES (v_user_a_id, v_user_b_id, true)
    ON CONFLICT (user_a_id, user_b_id) DO NOTHING
    RETURNING id INTO v_match_id;

    IF v_match_id IS NOT NULL THEN
      RETURN QUERY SELECT true, v_match_id;
    ELSE
      SELECT id INTO v_match_id
      FROM matches
      WHERE user_a_id = v_user_a_id AND user_b_id = v_user_b_id;
      RETURN QUERY SELECT true, v_match_id;
    END IF;
  ELSE
    RETURN QUERY SELECT false, NULL::uuid;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION check_and_create_match(uuid, uuid) TO authenticated;

-- PASO 3: Crear función del trigger
CREATE OR REPLACE FUNCTION auto_create_match_on_like()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_a_id uuid;
  v_user_b_id uuid;
  v_reverse_swipe_exists boolean;
BEGIN
  IF NEW.direction = 'like' THEN
    SELECT EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND direction = 'like'
    ) INTO v_reverse_swipe_exists;

    IF v_reverse_swipe_exists THEN
      IF NEW.swiper_id < NEW.swiped_id THEN
        v_user_a_id := NEW.swiper_id;
        v_user_b_id := NEW.swiped_id;
      ELSE
        v_user_a_id := NEW.swiped_id;
        v_user_b_id := NEW.swiper_id;
      END IF;

      INSERT INTO matches (user_a_id, user_b_id, is_active)
      VALUES (v_user_a_id, v_user_b_id, true)
      ON CONFLICT (user_a_id, user_b_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- PASO 4: Crear el trigger
DROP TRIGGER IF EXISTS trigger_auto_create_match ON swipes;

CREATE TRIGGER trigger_auto_create_match
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_match_on_like();

-- PASO 5: Crear matches para los swipes existentes que faltan
INSERT INTO matches (user_a_id, user_b_id, is_active)
SELECT DISTINCT
  LEAST(s1.swiper_id, s1.swiped_id) as user_a_id,
  GREATEST(s1.swiper_id, s1.swiped_id) as user_b_id,
  true as is_active
FROM swipes s1
JOIN swipes s2 ON
  s1.swiper_id = s2.swiped_id AND
  s1.swiped_id = s2.swiper_id
LEFT JOIN matches m ON (
  m.user_a_id = LEAST(s1.swiper_id, s1.swiped_id) AND
  m.user_b_id = GREATEST(s1.swiper_id, s1.swiped_id)
)
WHERE
  s1.direction = 'like' AND
  s2.direction = 'like' AND
  s1.swiper_id < s2.swiper_id AND
  m.id IS NULL
ON CONFLICT (user_a_id, user_b_id) DO NOTHING;

-- PASO 6: Verificar resultados
SELECT COUNT(*) as "Total de matches creados" FROM matches;

-- Mostrar últimos matches con nombres
SELECT
  m.created_at,
  p1.name as "Usuario A",
  p2.name as "Usuario B"
FROM matches m
JOIN profiles p1 ON m.user_a_id = p1.user_id
JOIN profiles p2 ON m.user_b_id = p2.user_id
ORDER BY m.created_at DESC
LIMIT 10;
