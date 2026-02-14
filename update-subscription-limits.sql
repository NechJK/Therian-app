-- Actualizar límites de planes de suscripción
-- Ejecuta esto en Supabase SQL Editor

-- Actualizar función get_user_limits con nuevos límites
CREATE OR REPLACE FUNCTION get_user_limits(p_user_id uuid)
RETURNS TABLE (
  daily_likes integer,
  daily_super_likes integer,
  daily_rewinds integer,
  can_see_who_liked boolean,
  unlimited_likes boolean,
  boost_available boolean,
  ad_free boolean
) AS $$
DECLARE
  v_plan_type text;
BEGIN
  SELECT plan_type INTO v_plan_type
  FROM subscriptions
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;

  -- Si no hay suscripción, usar free
  v_plan_type := COALESCE(v_plan_type, 'free');

  CASE v_plan_type
    WHEN 'free' THEN
      -- FREE: 20 likes, 0 super likes, rewinds ilimitados, no puede ver quién le dio like
      RETURN QUERY SELECT 20::integer, 0::integer, 999999::integer, false, false, false, false;
    WHEN 'plus' THEN
      -- PLUS ($4.99): Ilimitado, 5 super likes, rewinds ilimitados, SÍ puede ver quién le dio like
      RETURN QUERY SELECT 999999::integer, 5::integer, 999999::integer, true, true, true, true;
    WHEN 'gold' THEN
      -- GOLD ($8.99): Ilimitado, 10 super likes, rewinds ilimitados, ver quién le dio like
      RETURN QUERY SELECT 999999::integer, 10::integer, 999999::integer, true, true, true, true;
    WHEN 'platinum' THEN
      -- PLATINUM ($14.99): Todo ilimitado
      RETURN QUERY SELECT 999999::integer, 999999::integer, 999999::integer, true, true, true, true;
    ELSE
      -- Default a free
      RETURN QUERY SELECT 20::integer, 0::integer, 999999::integer, false, false, false, false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que funciona
SELECT * FROM get_user_limits(auth.uid());
