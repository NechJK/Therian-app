-- Script para debuggear el sistema de matches
-- Ejecuta esto en Supabase SQL Editor para ver qué está pasando

-- 1. Ver TODOS los swipes con nombres de usuarios (para entender quién le dio like a quién)
SELECT
  s.id,
  s.created_at,
  s.direction,
  p1.name as "Usuario que dio swipe",
  p1.user_id as "swiper_id",
  p2.name as "Usuario que recibió swipe",
  p2.user_id as "swiped_id"
FROM swipes s
JOIN profiles p1 ON s.swiper_id = p1.user_id
JOIN profiles p2 ON s.swiped_id = p2.user_id
WHERE s.direction = 'like'
ORDER BY s.created_at DESC;

-- 2. Detectar likes MUTUOS que deberían ser matches
SELECT
  p1.name as "Usuario A",
  p2.name as "Usuario B",
  s1.created_at as "A le dio like a B en",
  s2.created_at as "B le dio like a A en"
FROM swipes s1
JOIN swipes s2 ON
  s1.swiper_id = s2.swiped_id AND
  s1.swiped_id = s2.swiper_id
JOIN profiles p1 ON s1.swiper_id = p1.user_id
JOIN profiles p2 ON s1.swiped_id = p2.user_id
WHERE
  s1.direction = 'like' AND
  s2.direction = 'like' AND
  s1.swiper_id < s2.swiper_id  -- Evitar duplicados
ORDER BY s1.created_at DESC;

-- 3. Ver todos los matches existentes
SELECT
  m.id,
  m.created_at,
  p1.name as "Usuario A",
  p2.name as "Usuario B",
  m.is_active
FROM matches m
JOIN profiles p1 ON m.user_a_id = p1.user_id
JOIN profiles p2 ON m.user_b_id = p2.user_id
ORDER BY m.created_at DESC;

-- 4. Encontrar likes mutuos SIN match (ERROR!)
SELECT
  p1.name as "Usuario A",
  p1.user_id as "user_a_id",
  p2.name as "Usuario B",
  p2.user_id as "user_b_id",
  'FALTA MATCH!' as estado
FROM swipes s1
JOIN swipes s2 ON
  s1.swiper_id = s2.swiped_id AND
  s1.swiped_id = s2.swiper_id
JOIN profiles p1 ON s1.swiper_id = p1.user_id
JOIN profiles p2 ON s1.swiped_id = p2.user_id
LEFT JOIN matches m ON (
  (m.user_a_id = LEAST(s1.swiper_id, s1.swiped_id) AND
   m.user_b_id = GREATEST(s1.swiper_id, s1.swiped_id))
)
WHERE
  s1.direction = 'like' AND
  s2.direction = 'like' AND
  s1.swiper_id < s2.swiper_id AND
  m.id IS NULL;  -- No existe match
