-- Tabla para almacenar mensajes que Roblox consultará
CREATE TABLE public.roblox_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered BOOLEAN NOT NULL DEFAULT false
);

-- Índice para consultar el último mensaje no entregado rápidamente
CREATE INDEX idx_roblox_messages_delivered_created ON public.roblox_messages(delivered, created_at DESC);

-- RLS: Permitir a todos leer y escribir (será protegido por API key en edge function)
ALTER TABLE public.roblox_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura pública de mensajes"
ON public.roblox_messages
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserción pública de mensajes"
ON public.roblox_messages
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de mensajes"
ON public.roblox_messages
FOR UPDATE
USING (true);