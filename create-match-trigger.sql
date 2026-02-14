-- Trigger automático para crear matches
-- Cada vez que alguien da like, este trigger verifica si hay match y lo crea automáticamente

-- Función que ejecutará el trigger
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
  -- Solo procesar si es un like
  IF NEW.direction = 'like' THEN
    -- Verificar si existe un like reciproco
    SELECT EXISTS (
      SELECT 1 FROM swipes
      WHERE swiper_id = NEW.swiped_id
        AND swiped_id = NEW.swiper_id
        AND direction = 'like'
    ) INTO v_reverse_swipe_exists;

    -- Si existe like reciproco, crear match
    IF v_reverse_swipe_exists THEN
      -- Ordenar IDs (user_a_id siempre debe ser menor que user_b_id)
      IF NEW.swiper_id < NEW.swiped_id THEN
        v_user_a_id := NEW.swiper_id;
        v_user_b_id := NEW.swiped_id;
      ELSE
        v_user_a_id := NEW.swiped_id;
        v_user_b_id := NEW.swiper_id;
      END IF;

      -- Crear el match si no existe
      INSERT INTO matches (user_a_id, user_b_id, is_active)
      VALUES (v_user_a_id, v_user_b_id, true)
      ON CONFLICT (user_a_id, user_b_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Eliminar trigger anterior si existe
DROP TRIGGER IF EXISTS trigger_auto_create_match ON swipes;

-- Crear el trigger que se ejecuta DESPUÉS de insertar un swipe
CREATE TRIGGER trigger_auto_create_match
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_match_on_like();

-- Comentario explicativo
COMMENT ON TRIGGER trigger_auto_create_match ON swipes IS
  'Crea automáticamente un match cuando dos usuarios se dan like mutuamente, sin importar el orden';
