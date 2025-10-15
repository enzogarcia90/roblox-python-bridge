import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Message {
  id: string;
  message: string;
  delivered: boolean;
  created_at: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("roblox_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading messages:", error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historial de Mensajes</h1>
            <p className="text-muted-foreground">Todos los mensajes enviados al sistema</p>
          </div>

          <Card className="p-6">
            {loading ? (
              <p>Cargando mensajes...</p>
            ) : messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay mensajes todavía
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.message}</TableCell>
                      <TableCell>
                        <Badge variant={message.delivered ? "default" : "secondary"}>
                          {message.delivered ? "Entregado" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(message.created_at), "dd/MM/yyyy HH:mm:ss")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
