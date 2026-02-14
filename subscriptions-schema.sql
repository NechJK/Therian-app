-- ============================================
-- SISTEMA DE SUSCRIPCIONES FREEMIUM
-- Ejecuta este script en Supabase SQL Editor
-- ============================================

-- Tabla de suscripciones de usuarios
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('free', 'plus', 'gold', 'platinum')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabla de transacciones/pagos
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount decimal(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text CHECK (payment_method IN ('stripe', 'paypal', 'card')),
  stripe_payment_intent_id text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla de uso diario (para límites)
CREATE TABLE IF NOT EXISTS daily_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  likes_count integer DEFAULT 0,
  super_likes_count integer DEFAULT 0,
  rewinds_count integer DEFAULT 0,
  boosts_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, date);

-- RLS Policies para subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios pueden ver su propia suscripción" ON subscriptions;
CREATE POLICY "Los usuarios pueden ver su propia suscripción"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propia suscripción" ON subscriptions;
CREATE POLICY "Los usuarios pueden actualizar su propia suscripción"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies para transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias transacciones" ON transactions;
CREATE POLICY "Los usuarios pueden ver sus propias transacciones"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies para daily_usage
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Los usuarios pueden ver su propio uso" ON daily_usage;
CREATE POLICY "Los usuarios pueden ver su propio uso"
  ON daily_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio uso" ON daily_usage;
CREATE POLICY "Los usuarios pueden actualizar su propio uso"
  ON daily_usage FOR ALL
  USING (auth.uid() = user_id);

-- Función para crear suscripción gratuita automáticamente
CREATE OR REPLACE FUNCTION create_free_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan_type, current_period_start, current_period_end)
  VALUES (
    NEW.id,
    'free',
    now(),
    now() + interval '100 years' -- Free plan nunca expira
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear suscripción gratuita al crear usuario
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_free_subscription();

-- Función para obtener límites según el plan
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
      RETURN QUERY SELECT 100::integer, 1::integer, 0::integer, false, false, false, false;
    WHEN 'plus' THEN
      RETURN QUERY SELECT 999999::integer, 5::integer, 3::integer, false, true, true, true;
    WHEN 'gold' THEN
      RETURN QUERY SELECT 999999::integer, 10::integer, 5::integer, true, true, true, true;
    WHEN 'platinum' THEN
      RETURN QUERY SELECT 999999::integer, 999999::integer, 999999::integer, true, true, true, true;
    ELSE
      RETURN QUERY SELECT 100::integer, 1::integer, 0::integer, false, false, false, false;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_limits(uuid) TO authenticated;

-- Función para verificar si el usuario puede dar like
CREATE OR REPLACE FUNCTION can_user_like(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  v_limits record;
  v_usage record;
BEGIN
  -- Obtener límites del plan
  SELECT * INTO v_limits FROM get_user_limits(p_user_id);

  -- Si tiene likes ilimitados, retornar true
  IF v_limits.unlimited_likes THEN
    RETURN true;
  END IF;

  -- Obtener uso de hoy
  SELECT * INTO v_usage
  FROM daily_usage
  WHERE user_id = p_user_id AND date = CURRENT_DATE;

  -- Si no hay registro, puede dar like
  IF v_usage IS NULL THEN
    RETURN true;
  END IF;

  -- Verificar si ha excedido el límite
  RETURN v_usage.likes_count < v_limits.daily_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION can_user_like(uuid) TO authenticated;

-- Función para incrementar contador de likes
CREATE OR REPLACE FUNCTION increment_like_count(p_user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_usage (user_id, date, likes_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    likes_count = daily_usage.likes_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_like_count(uuid) TO authenticated;

-- Crear suscripciones gratuitas para usuarios existentes
INSERT INTO subscriptions (user_id, plan_type, current_period_start, current_period_end)
SELECT
  id,
  'free',
  now(),
  now() + interval '100 years'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions WHERE subscriptions.user_id = auth.users.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Verificar resultados
SELECT
  COUNT(*) as total_subscriptions,
  plan_type,
  status
FROM subscriptions
GROUP BY plan_type, status;
