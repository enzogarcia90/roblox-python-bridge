import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { ServerConfig } from "@/components/ServerConfig";
import { MessageSender } from "@/components/MessageSender";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { RobloxScript } from "@/components/RobloxScript";
import { toast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

export default function Config() {
  const [session, setSession] = useState<Session | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadApiKey();
      }
    });
  }, []);

  const loadApiKey = async () => {
    const { data, error } = await supabase
      .from("api_config")
      .select("api_key")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setApiKey(data.api_key);
    }
  };

  const saveApiKey = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "No estás autenticado",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey || apiKey.trim().length === 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa una API key válida",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.functions.invoke("updateApiKey", {
      body: { newKey: apiKey },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar la API key",
        variant: "destructive",
      });
    } else {
      toast({
        title: "✅ API Key guardada",
        description: "La API key se ha actualizado correctamente",
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="text-muted-foreground">Configura la API y envía mensajes a Roblox</p>
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
    </div>
  );
}
