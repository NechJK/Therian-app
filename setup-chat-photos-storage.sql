-- Instrucciones para crear el Storage Bucket para fotos de chat

/*
IMPORTANTE: Este SQL NO se puede ejecutar directamente.
Debes configurar el bucket manualmente en Supabase Dashboard:

1. Ve a Supabase Dashboard → Storage
2. Click en "New bucket"
3. Nombre del bucket: "chat-photos"
4. Público: SÍ (marcar "Public bucket")
5. Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
6. Max file size: 5 MB

Después de crear el bucket, aplica estas políticas RLS:
*/

-- Política para permitir a usuarios autenticados subir fotos
CREATE POLICY "Users can upload chat photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Política para permitir a todos ver las fotos (bucket público)
CREATE POLICY "Anyone can view chat photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'chat-photos');

-- Política para permitir a usuarios eliminar sus propias fotos
CREATE POLICY "Users can delete own chat photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-photos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Verificar que las políticas funcionan
SELECT * FROM storage.buckets WHERE id = 'chat-photos';
