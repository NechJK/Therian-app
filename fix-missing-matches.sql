-- Script para CREAR matches que faltan
-- Esto creará matches para todos los likes mutuos que no tienen match

-- ADVERTENCIA: Solo ejecuta esto UNA VEZ o creará duplicados

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
  s1.swiper_id < s2.swiper_id AND  -- Evitar duplicados
  m.id IS NULL  -- Solo los que NO tienen match
ON CONFLICT DO NOTHING;  -- Por si acaso hay duplicados

-- Después de ejecutar esto, verifica con:
-- SELECT * FROM matches ORDER BY created_at DESC;
