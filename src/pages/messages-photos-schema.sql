-- Agregar columnas para soportar fotos en mensajes
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS photo_url text,
ADD COLUMN IF NOT EXISTS message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'photo'));

-- Crear índice para búsquedas por tipo
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);

-- Comentarios para documentación
COMMENT ON COLUMN messages.photo_url IS 'URL de la foto subida a Supabase Storage';
COMMENT ON COLUMN messages.message_type IS 'Tipo de mensaje: text o photo';
