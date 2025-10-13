import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface MessageSenderProps {
  apiUrl: string;
  apiKey: string;
  isConnected: boolean;
}

export const MessageSender = ({ apiUrl, apiKey, isConnected }: MessageSenderProps) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe un mensaje",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Configura primero la API key",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${apiUrl}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          key: apiKey,
        }),
      });

      if (response.ok) {
        toast({
          title: "✅ Mensaje enviado",
          description: "Roblox lo recibirá en su próxima consulta",
        });
        setMessage("");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error al enviar",
          description: errorData.error || "No se pudo enviar el mensaje",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con la API",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Send className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold text-foreground">Enviar Mensaje a Roblox</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          placeholder="Escribe el mensaje que aparecerá en el chat de Roblox..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          disabled={!isConnected}
        />
      </div>

      <Button 
        onClick={sendMessage} 
        disabled={isSending || !isConnected}
        className="w-full"
      >
        {isSending ? "Enviando..." : "Enviar Mensaje"}
      </Button>

      {!isConnected && (
        <p className="text-sm text-muted-foreground text-center">
          Prueba la conexión primero antes de enviar mensajes
        </p>
      )}
    </div>
  );
};
