import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <Alert variant={isConnected ? "default" : "destructive"}>
      {isConnected ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <XCircle className="h-4 w-4" />
      )}
      <AlertTitle>
        {isConnected ? "Servidor Conectado" : "Servidor Desconectado"}
      </AlertTitle>
      <AlertDescription>
        {isConnected
          ? "La conexión con el servidor Python está activa y lista para enviar mensajes."
          : "Configura y prueba la conexión con tu servidor Python para comenzar."}
      </AlertDescription>
    </Alert>
  );
};
