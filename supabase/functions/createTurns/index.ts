import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { game_id } = await req.json();

  const { data: players, error: playerError } = await supabase
    .from("players")
    .select("user_id")
    .eq("game_id", game_id);

  if (playerError || !players || players.length < 2 || players.length > 4) {
    return new Response(
      JSON.stringify({ error: "Invalid player data", detail: playerError }), { 
        status: 400,
        headers: corsHeaders,
       }
    );
  }

  const player_ids = players.map((p) => p.user_id);
  const shuffled = [...player_ids].sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const turns = shuffled.map((sender, idx) => {
      const receiver = shuffled[(idx + 1) % shuffled.length];
      return {
        game_id,
        turn_number: i + 1,
        sender_id: sender,
        receiver_id: receiver,
        type: i % 2 === 0 ? 'WORD' : 'DRAWING',
      };
    });

    const { error: insertError } = await supabase.from("turns").insert(turns);

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: corsHeaders,
  });
});
