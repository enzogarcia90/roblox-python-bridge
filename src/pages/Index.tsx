import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ServerConfig } from "@/components/ServerConfig";
import { MessageSender } from "@/components/MessageSender";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { RobloxScript } from "@/components/RobloxScript";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  // Cargar la API key al iniciar
  useEffect(() => {
    const loadApiKey = async () => {
      const { data } = await supabase
        .from("api_config")
        .select("api_key")
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setApiKey(data.api_key);
      }
    };
    loadApiKey();
  }, []);

  const saveApiKey = async () => {
    if (!apiKey || apiKey.trim().length === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una API key válida",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/updateApiKey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newKey: apiKey,
        }),
      });

      if (response.ok) {
        toast({
          title: "✅ API Key guardada",
          description: "La API key se ha actualizado correctamente",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error al guardar",
          description: errorData.error || "No se pudo guardar la API key",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con la API",
        variant: "destructive",
      });
    }
  };

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
            onSaveApiKey={saveApiKey}
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
