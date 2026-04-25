// ===============================
// SUPABASE.JS (CLEAN)
// ===============================

const SUPABASE_URL = "https://snokfmygrgittxvwnumv.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// -------------------------------
// ARTICLES
// -------------------------------
async function getArticles() {
  const { data, error } = await supabaseClient
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Articles error:", error);
    return [];
  }

  return data;
}


// -------------------------------
// FEATURED ARTICLES
// -------------------------------
async function getFeaturedArticles(limit = 3) {
  const { data, error } = await supabaseClient
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Featured error:", error);
    return [];
  }

  return data;
}


// -------------------------------
// UPDATES (FULL DATA — NO LIMIT)
// -------------------------------
async function getUpdates() {
  const { data, error } = await supabaseClient
    .from("updates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Updates error:", error);
    return [];
  }

  return data;
}


// -------------------------------
// STATS
// -------------------------------
async function getStats() {
  const { data, error } = await supabaseClient
    .from("stats")
    .select("*")
    .single();

  if (error) {
    console.error("Stats error:", error);
    return null;
  }

  return data;
}


// -------------------------------
// ACTIONS
// -------------------------------
async function incrementResource(resourceKey) {
  await supabaseClient.rpc("increment_download", {
    resource_key: resourceKey
  });
}

async function incrementVisitors() {
  await supabaseClient.rpc("increment_visitors");
}


// -------------------------------
// GLOBAL EXPORTS
// -------------------------------
window.getArticles = getArticles;
window.getFeaturedArticles = getFeaturedArticles;
window.getUpdates = getUpdates;
window.getStats = getStats;
window.incrementResource = incrementResource;
window.incrementVisitors = incrementVisitors;