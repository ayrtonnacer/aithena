import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, perPage = 1 } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'query'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PEXELS_API_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_API_KEY) {
      throw new Error("PEXELS_API_KEY is not configured");
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;

    const res = await fetch(url, {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Pexels API error [${res.status}]: ${body}`);
    }

    const data = await res.json();

    const photos = (data.photos ?? []).map((p: any) => ({
      id: p.id,
      alt: p.alt,
      src: p.src?.medium,
      photographer: p.photographer,
    }));

    return new Response(JSON.stringify({ photos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Pexels search error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
