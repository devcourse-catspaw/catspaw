import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

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
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const { game, player } = await req.json()

    const { data: newGameRoom, error: gameError } = await supabase
      .from('games')
      .insert(game)
      .select()
      .single()

    if (gameError) {
      return new Response(JSON.stringify({ error: gameError.message }), {
        status: 400,
        headers: corsHeaders
      })
    }

    const playerWithGameId = {
      ...player,
      game_id: newGameRoom.id,
      user_id: newGameRoom.leader_id,
      is_ready: false,
      is_leader: true,
    }

    const { error: playerError } = await supabase
      .from('players')
      .insert(playerWithGameId)

    if (playerError) {
      return new Response(JSON.stringify({ error: playerError.message }), {
        status: 400,
        headers: corsHeaders
      })
    }

    return new Response(JSON.stringify({ success: true, game: newGameRoom }), {
        status: 200,
        headers: corsHeaders
      })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal server error', e }), {
        status: 500,
        headers: corsHeaders
      })
  }
})

