import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ServerConfigProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onTestConnection: () => void;
}

export const ServerConfig = ({
  apiKey,
  onApiKeyChange,
  onTestConnection,
}: ServerConfigProps) => {
  const [copied, setCopied] = useState(false);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Configuración de la API</h2>
      </div>

      <div className="space-y-2 p-4 bg-muted rounded-lg">
        <Label className="text-sm font-medium">URL base de la API</Label>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm bg-background p-2 rounded border">
            {apiUrl}
          </code>
          <Button
            size="icon"
            variant="outline"
            onClick={() => copyToClipboard(apiUrl)}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Ingresa la API key para Roblox"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Esta clave debe usarse en el script de Roblox para autenticación
        </p>
      </div>

      <Button onClick={onTestConnection} className="w-full">
        Probar Conexión
      </Button>
    </div>
  );
};
