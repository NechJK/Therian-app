-- RESET COMPLETO - Borrar todos los swipes y matches
-- Ejecuta esto para que todos puedan volver a verse desde cero

-- Borrar todos los matches
DELETE FROM matches;

-- Borrar todos los swipes
DELETE FROM swipes;

-- Verificar que se borraron
SELECT
  (SELECT COUNT(*) FROM swipes) as "Swipes (debe ser 0)",
  (SELECT COUNT(*) FROM matches) as "Matches (debe ser 0)";

-- Listo! Ahora todos los usuarios pueden volver a verse en la app
