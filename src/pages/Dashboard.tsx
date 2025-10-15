import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Activity, CheckCircle } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    deliveredMessages: 0,
    pendingMessages: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [messagesResult, usersResult] = await Promise.all([
      supabase.from("roblox_messages").select("*", { count: "exact" }),
      supabase.from("profiles").select("*", { count: "exact" }),
    ]);

    const messages = messagesResult.data || [];
    const deliveredCount = messages.filter((m) => m.delivered).length;

    setStats({
      totalMessages: messagesResult.count || 0,
      deliveredMessages: deliveredCount,
      pendingMessages: (messagesResult.count || 0) - deliveredCount,
      totalUsers: usersResult.count || 0,
    });
  };

  const statCards = [
    {
      title: "Total Mensajes",
      value: stats.totalMessages,
      icon: MessageSquare,
      description: "Mensajes enviados en total",
    },
    {
      title: "Mensajes Entregados",
      value: stats.deliveredMessages,
      icon: CheckCircle,
      description: "Mensajes recibidos por Roblox",
    },
    {
      title: "Mensajes Pendientes",
      value: stats.pendingMessages,
      icon: Activity,
      description: "Esperando ser recogidos",
    },
    {
      title: "Usuarios Totales",
      value: stats.totalUsers,
      icon: Users,
      description: "Usuarios registrados",
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general del sistema</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
