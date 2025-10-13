import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface ServerConfigProps {
  serverUrl: string;
  apiKey: string;
  onServerUrlChange: (url: string) => void;
  onApiKeyChange: (key: string) => void;
  onTestConnection: () => void;
}

export const ServerConfig = ({
  serverUrl,
  apiKey,
  onServerUrlChange,
  onApiKeyChange,
  onTestConnection,
}: ServerConfigProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Configuración del Servidor</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serverUrl">URL del Servidor Python</Label>
        <Input
          id="serverUrl"
          type="text"
          placeholder="http://tu-ip-publica:puerto"
          value={serverUrl}
          onChange={(e) => onServerUrlChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Ejemplo: http://123.456.789.0:5000
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="Tu clave API secreta"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Debe coincidir con la clave configurada en tu servidor Python
        </p>
      </div>

      <Button onClick={onTestConnection} className="w-full">
        Probar Conexión
      </Button>
    </div>
  );
};
