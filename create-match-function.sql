-- Función de base de datos para crear matches automáticamente
-- Esta función se ejecuta cada vez que alguien da like y verifica si hay match

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
  -- Verificar si existe un like reciproco
  SELECT EXISTS (
    SELECT 1 FROM swipes
    WHERE swiper_id = p_swiped_id
      AND swiped_id = p_swiper_id
      AND direction = 'like'
  ) INTO v_reverse_swipe_exists;

  -- Si existe like reciproco, crear match
  IF v_reverse_swipe_exists THEN
    -- Ordenar IDs (user_a_id siempre debe ser menor que user_b_id)
    IF p_swiper_id < p_swiped_id THEN
      v_user_a_id := p_swiper_id;
      v_user_b_id := p_swiped_id;
    ELSE
      v_user_a_id := p_swiped_id;
      v_user_b_id := p_swiper_id;
    END IF;

    -- Intentar crear el match (evitar duplicados con ON CONFLICT)
    INSERT INTO matches (user_a_id, user_b_id, is_active)
    VALUES (v_user_a_id, v_user_b_id, true)
    ON CONFLICT (user_a_id, user_b_id) DO NOTHING
    RETURNING id INTO v_match_id;

    -- Si se creó un match nuevo, retornar true
    IF v_match_id IS NOT NULL THEN
      RETURN QUERY SELECT true, v_match_id;
    ELSE
      -- Match ya existía, obtener su ID
      SELECT id INTO v_match_id
      FROM matches
      WHERE user_a_id = v_user_a_id AND user_b_id = v_user_b_id;

      RETURN QUERY SELECT true, v_match_id;
    END IF;
  ELSE
    -- No hay match
    RETURN QUERY SELECT false, NULL::uuid;
  END IF;
END;
$$;

-- Dar permisos a usuarios autenticados
GRANT EXECUTE ON FUNCTION check_and_create_match(uuid, uuid) TO authenticated;

-- Asegurar que existe el constraint de unique en matches
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user_a_id_user_b_id_key;
ALTER TABLE matches ADD CONSTRAINT matches_user_a_id_user_b_id_key UNIQUE (user_a_id, user_b_id);
