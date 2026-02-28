import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PexelsPhoto {
  id: number;
  alt: string;
  src: string;
  photographer: string;
}

export function usePexelsImage(query: string | undefined) {
  const [photo, setPhoto] = useState<PexelsPhoto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    setLoading(true);

    supabase.functions
      .invoke("pexels-search", { body: { query, perPage: 1 } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Pexels fetch error:", error);
          setPhoto(null);
        } else {
          setPhoto(data?.photos?.[0] ?? null);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [query]);

  return { photo, loading };
}
