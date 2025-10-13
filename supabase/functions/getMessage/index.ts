import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { key } = await req.json();
    const ROBLOX_API_KEY = Deno.env.get("ROBLOX_API_KEY");

    // Verificar API key
    if (key !== ROBLOX_API_KEY) {
      console.error("Invalid API key provided");
      return new Response(
        JSON.stringify({ error: "Invalid API key" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Crear cliente de Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener el mensaje más reciente no entregado
    const { data: message, error } = await supabase
      .from("roblox_messages")
      .select("*")
      .eq("delivered", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching message:", error);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Si hay un mensaje, marcarlo como entregado
    if (message) {
      const { error: updateError } = await supabase
        .from("roblox_messages")
        .update({ delivered: true })
        .eq("id", message.id);

      if (updateError) {
        console.error("Error updating message:", updateError);
      }

      console.log("Message retrieved and marked as delivered:", message.message);
      
      return new Response(
        JSON.stringify({ 
          message: message.message,
          key: ROBLOX_API_KEY 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // No hay mensajes pendientes
    return new Response(
      JSON.stringify({ message: null }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in getMessage function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
