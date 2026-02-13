-- Kindred Database Schema
-- Este script debe ejecutarse en el SQL Editor de Supabase

-- Tabla de perfiles de usuario
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 45),
  bio TEXT,
  theriotype TEXT NOT NULL,
  photos TEXT[] NOT NULL,
  intentions TEXT[],
  gender TEXT,
  orientation TEXT,
  location JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de swipes (likes/nopes)
CREATE TABLE swipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('like', 'nope', 'super')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- Tabla de matches
CREATE TABLE matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_a_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_b_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_a_id, user_b_id),
  CHECK (user_a_id < user_b_id)
);

-- Tabla de mensajes
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de theriotypes (opcional, para referencia)
CREATE TABLE theriotypes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Insertar theriotypes predefinidos
INSERT INTO theriotypes (id, name, emoji, category) VALUES
('wolf', 'Lobo', '🐺', 'mammal'),
('fox', 'Zorro', '🦊', 'mammal'),
('cat', 'Gato', '🐱', 'mammal'),
('dog', 'Perro', '🐕', 'mammal'),
('bear', 'Oso', '🐻', 'mammal'),
('lion', 'León', '🦁', 'mammal'),
('tiger', 'Tigre', '🐯', 'mammal'),
('deer', 'Ciervo', '🦌', 'mammal'),
('rabbit', 'Conejo', '🐰', 'mammal'),
('raccoon', 'Mapache', '🦝', 'mammal'),
('bat', 'Murciélago', '🦇', 'mammal'),
('otter', 'Nutria', '🦦', 'mammal'),
('horse', 'Caballo', '🐴', 'mammal'),
('owl', 'Búho', '🦉', 'bird'),
('eagle', 'Águila', '🦅', 'bird'),
('crow', 'Cuervo', '🐦‍⬛', 'bird'),
('raven', 'Cuervo (Raven)', '🐦', 'bird'),
('snake', 'Serpiente', '🐍', 'reptile'),
('dragon', 'Dragón', '🐉', 'mythical'),
('phoenix', 'Fénix', '🔥', 'mythical'),
('other', 'Otro', '✨', 'other');

-- Índices para mejor performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_is_active ON profiles(is_active);
CREATE INDEX idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_messages_match ON messages(match_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Los usuarios pueden ver perfiles activos"
  ON profiles FOR SELECT
  USING (is_active = true);

CREATE POLICY "Los usuarios pueden insertar su propio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para swipes
CREATE POLICY "Los usuarios pueden ver sus propios swipes"
  ON swipes FOR SELECT
  USING (auth.uid() = swiper_id);

CREATE POLICY "Los usuarios pueden crear swipes"
  ON swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Políticas RLS para matches
CREATE POLICY "Los usuarios pueden ver sus matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "El sistema puede crear matches"
  ON matches FOR INSERT
  WITH CHECK (true);

-- Políticas RLS para messages
CREATE POLICY "Los usuarios pueden ver mensajes de sus matches"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = messages.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

CREATE POLICY "Los usuarios pueden enviar mensajes en sus matches"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Realtime para mensajes
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Storage bucket para fotos
-- Esto debe hacerse desde la UI de Supabase en Storage
-- Crear bucket llamado 'photos' con política pública de lectura
