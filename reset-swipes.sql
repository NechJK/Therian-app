-- ============================================
-- RESETEAR SWIPES Y MATCHES
-- Ejecuta este script en Supabase SQL Editor
-- ============================================

-- OPCIÓN 1: Borrar TODOS los swipes y matches (reset completo)
-- ⚠️ ADVERTENCIA: Esto borrará todo el historial de swipes y matches

-- Descomentar estas líneas para ejecutar:
-- DELETE FROM matches;
-- DELETE FROM swipes;


-- OPCIÓN 2: Borrar solo los swipes de usuarios específicos
-- Reemplaza 'nombre_usuario_1' y 'nombre_usuario_2' con los nombres reales

DELETE FROM swipes
WHERE swiper_id IN (
  SELECT user_id FROM profiles
  WHERE name IN ('Aerith', 'porky', 'TU pollito', 'perrito wau wau')
);

DELETE FROM matches
WHERE user_a_id IN (
  SELECT user_id FROM profiles
  WHERE name IN ('Aerith', 'porky', 'TU pollito', 'perrito wau wau')
)
OR user_b_id IN (
  SELECT user_id FROM profiles
  WHERE name IN ('Aerith', 'porky', 'TU pollito', 'perrito wau wau')
);


-- OPCIÓN 3: Borrar swipes entre dos usuarios específicos
-- Reemplaza los nombres con los usuarios que quieres resetear

-- DELETE FROM swipes
-- WHERE (
--   swiper_id = (SELECT user_id FROM profiles WHERE name = 'Usuario A' LIMIT 1)
--   AND swiped_id = (SELECT user_id FROM profiles WHERE name = 'Usuario B' LIMIT 1)
-- )
-- OR (
--   swiper_id = (SELECT user_id FROM profiles WHERE name = 'Usuario B' LIMIT 1)
--   AND swiped_id = (SELECT user_id FROM profiles WHERE name = 'Usuario A' LIMIT 1)
-- );


-- OPCIÓN 4: Borrar solo los swipes de NOPE (mantener los likes)
-- Útil si quieres que vuelvan a aparecer perfiles que rechazaste

-- DELETE FROM swipes WHERE direction = 'nope';


-- VERIFICAR RESULTADOS
SELECT COUNT(*) as "Swipes restantes" FROM swipes;
SELECT COUNT(*) as "Matches restantes" FROM matches;

-- Ver perfiles que aún tienen swipes
SELECT
  p.name,
  COUNT(s.id) as "Cantidad de swipes"
FROM profiles p
LEFT JOIN swipes s ON s.swiper_id = p.user_id
GROUP BY p.user_id, p.name
ORDER BY COUNT(s.id) DESC;
