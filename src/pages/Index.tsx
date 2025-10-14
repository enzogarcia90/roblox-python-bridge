import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { ServerConfig } from "@/components/ServerConfig";
import { MessageSender } from "@/components/MessageSender";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { RobloxScript } from "@/components/RobloxScript";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LogOut, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

  useEffect(() => {
    // Configurar listener de autenticación PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        } else {
          // Verificar rol de admin después de autenticación
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    // LUEGO verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
        setLoading(false);
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
        if (data) {
          loadApiKey();
        }
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const loadApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from("api_config")
        .select("api_key")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error loading API key:", error);
        toast({
          title: "Error",
          description: "Error al cargar la configuración",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setApiKey(data.api_key);
      }
    } catch (error) {
      console.error("Error loading API key:", error);
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

    try {
      const { data, error } = await supabase.functions.invoke("updateApiKey", {
        body: { newKey: apiKey },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error updating API key:", error);
        toast({
          title: "Error al guardar",
          description: error.message || "No se pudo guardar la API key",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "✅ API Key guardada",
        description: "La API key se ha actualizado correctamente",
      });
    } catch (error) {
      console.error("Error updating API key:", error);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Acceso Denegado</CardTitle>
            <CardDescription className="text-center">
              Necesitas permisos de administrador para acceder a esta página.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Tu cuenta no tiene rol de administrador asignado.
            </p>
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-foreground">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
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
