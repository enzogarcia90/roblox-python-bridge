import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Copy, Check, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ServerConfigProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  onTestConnection: () => void;
  onSaveApiKey: () => void;
}

export const ServerConfig = ({
  apiKey,
  onApiKeyChange,
  onTestConnection,
  onSaveApiKey,
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
          type="text"
          placeholder="Ingresa la API key para Roblox"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Esta clave debe usarse en el script de Roblox para autenticación
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={onSaveApiKey} variant="default" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          Guardar API Key
        </Button>
        <Button onClick={onTestConnection} variant="outline" className="flex-1">
          Probar Conexión
        </Button>
      </div>
    </div>
  );
};
