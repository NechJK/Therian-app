-- Actualizar el límite de edad de 45 a 100 años
-- Ejecutar en SQL Editor de Supabase

-- Eliminar el constraint antiguo
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_age_check;

-- Agregar nuevo constraint con edad hasta 100
ALTER TABLE profiles ADD CONSTRAINT profiles_age_check CHECK (age >= 18 AND age <= 100);
