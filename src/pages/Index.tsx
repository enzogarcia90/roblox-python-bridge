import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ServerConfig } from "@/components/ServerConfig";
import { MessageSender } from "@/components/MessageSender";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [serverUrl, setServerUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const testConnection = async () => {
    if (!serverUrl || !apiKey) {
      toast({
        title: "Error",
        description: "Por favor configura la URL del servidor y la API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Conexión exitosa",
          description: "El servidor Python está respondiendo correctamente",
        });
      } else {
        setIsConnected(false);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Error",
        description: "No se pudo alcanzar el servidor. Verifica la URL y que el servidor esté activo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Panel de Control Roblox-Python</h1>
          <p className="text-muted-foreground">
            Configura la conexión y envía mensajes a Roblox a través de tu servidor Python
          </p>
        </div>

        <ConnectionStatus isConnected={isConnected} />

        <Card className="p-6">
          <ServerConfig
            serverUrl={serverUrl}
            apiKey={apiKey}
            onServerUrlChange={setServerUrl}
            onApiKeyChange={setApiKey}
            onTestConnection={testConnection}
          />
        </Card>

        <Card className="p-6">
          <MessageSender
            serverUrl={serverUrl}
            apiKey={apiKey}
            isConnected={isConnected}
          />
        </Card>
      </div>
    </div>
  );
};

export default Index;
