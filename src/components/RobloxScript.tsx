import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RobloxScriptProps {
  apiUrl: string;
  apiKey: string;
}

export const RobloxScript = ({ apiUrl, apiKey }: RobloxScriptProps) => {
  const [copied, setCopied] = useState(false);

  const robloxScript = `-- Script para ServerScriptService en Roblox Studio
-- Conexión con API Lovable Cloud

local HttpService = game:GetService("HttpService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- CONFIGURACIÓN
local API_URL = "${apiUrl}/getMessage"
local API_KEY = "${apiKey || 'TU_API_KEY_AQUI'}"
local CHECK_INTERVAL = 3 -- segundos entre consultas

-- Obtener el evento de chat
local DefaultChatSystemChatEvents = ReplicatedStorage:WaitForChild("DefaultChatSystemChatEvents")
local SayMessageRequest = DefaultChatSystemChatEvents:WaitForChild("SayMessageRequest")

-- Función para consultar mensajes
local function checkForMessages()
    local success, response = pcall(function()
        return HttpService:RequestAsync({
            Url = API_URL,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = HttpService:JSONEncode({
                key = API_KEY
            })
        })
    end)
    
    if success and response.Success then
        local data = HttpService:JSONDecode(response.Body)
        
        if data.message then
            print("[Roblox-API] Mensaje recibido:", data.message)
            -- Enviar al chat global
            SayMessageRequest:FireServer(data.message, "All")
        end
    else
        warn("[Roblox-API] Error de conexión:", response)
    end
end

-- Loop principal
print("[Roblox-API] Iniciando conexión...")
print("[Roblox-API] URL:", API_URL)

while true do
    checkForMessages()
    wait(CHECK_INTERVAL)
end`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(robloxScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Script de Roblox</h2>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copiar Script
              </>
            )}
          </Button>
        </div>

        <Alert>
          <AlertTitle>Instrucciones para Roblox Studio</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Abre tu juego en Roblox Studio</li>
              <li>Habilita HttpService en Game Settings → Security → Allow HTTP Requests</li>
              <li>Crea un nuevo Script en ServerScriptService</li>
              <li>Copia y pega el código de abajo</li>
              <li>Asegúrate de que la API key esté configurada correctamente</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{robloxScript}</code>
          </pre>
        </div>

        <Alert variant="default">
          <AlertDescription>
            El script consultará la API cada 3 segundos y enviará los mensajes al chat de Roblox automáticamente.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
};
