const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_APIKEY = import.meta.env.VITE_SUPABASE_APIKEY;

export async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_APIKEY,
      Authorization: `Bearer ${SUPABASE_APIKEY}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Supabase forespørgslen kunne ikke gennemføres.");
  }

  return response.json();
}

export function getEvents() {
  return supabaseRequest(
    "/events?select=id,title,summary,date,category,image,venue:venues(name)&order=date.asc",
  );
}
