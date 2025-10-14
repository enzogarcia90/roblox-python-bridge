-- Crear tabla para configuración de API
CREATE TABLE IF NOT EXISTS public.api_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Permitir acceso público para leer/escribir la configuración
ALTER TABLE public.api_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.api_config
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON public.api_config
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.api_config
  FOR UPDATE USING (true);

-- Insertar una configuración por defecto
INSERT INTO public.api_config (api_key) 
VALUES ('cambiar-esta-key')
ON CONFLICT DO NOTHING;