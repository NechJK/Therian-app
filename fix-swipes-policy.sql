-- Arreglar políticas RLS para permitir detección de matches
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- Eliminar la política restrictiva actual
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios swipes" ON swipes;

-- Crear nueva política que permite:
-- 1. Ver swipes que TÚ hiciste (swiper_id = tu id)
-- 2. Ver swipes que OTROS hicieron HACIA TI (swiped_id = tu id)
CREATE POLICY "Los usuarios pueden ver swipes relevantes"
  ON swipes FOR SELECT
  USING (
    auth.uid() = swiper_id OR auth.uid() = swiped_id
  );

-- Esta política permite detectar matches porque ahora puedes ver
-- los swipes de otros usuarios que te dieron like
