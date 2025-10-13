import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ServerConfig } from "@/components/ServerConfig";
import { MessageSender } from "@/components/MessageSender";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { RobloxScript } from "@/components/RobloxScript";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  const testConnection = async () => {
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Por favor configura la API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "✅ API funcionando",
          description: "La API está activa y lista para recibir mensajes",
        });
      } else {
        setIsConnected(false);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con la API",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Error",
        description: "No se pudo alcanzar la API",
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
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            onTestConnection={testConnection}
          />
        </Card>

        <Card className="p-6">
          <MessageSender
            apiUrl={apiUrl}
            apiKey={apiKey}
            isConnected={isConnected}
          />
        </Card>

        <RobloxScript apiUrl={apiUrl} apiKey={apiKey} />
      </div>
    </div>
  );
};

export default Index;
