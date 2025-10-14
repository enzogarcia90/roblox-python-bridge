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
    const { newKey } = await req.json();

    if (!newKey || typeof newKey !== "string" || newKey.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "API key is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Obtener la configuración existente
    const { data: existingConfig } = await supabase
      .from("api_config")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (existingConfig) {
      // Actualizar la configuración existente
      const { error } = await supabase
        .from("api_config")
        .update({ api_key: newKey.trim(), updated_at: new Date().toISOString() })
        .eq("id", existingConfig.id);

      if (error) {
        console.error("Error updating API key:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update API key" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Crear nueva configuración
      const { error } = await supabase
        .from("api_config")
        .insert([{ api_key: newKey.trim() }]);

      if (error) {
        console.error("Error creating API key:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create API key" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    console.log("API key updated successfully");

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "API key updated successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in updateApiKey function:", error);
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
