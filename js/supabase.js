const SUPABASE_URL = "https://snokfmygrgittxvwnumv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNub2tmbXlncmdpdHR4dndudW12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjUwMTIsImV4cCI6MjA5MjYwMTAxMn0.iCE3WVio6qGD1G6PT6hPOFFcAS0D5J3kQPB7feky92Q";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// GENERIC FETCH
async function fetchTable(table, options = {}) {
  let query = supabaseClient.from(table).select("*");

  if (options.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? false
    });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}


// FUNCTIONS
async function getArticles() {
  return fetchTable("articles", {
    orderBy: { column: "created_at", ascending: false }
  });
}

async function getUpdates() {
  return fetchTable("updates", {
    orderBy: { column: "created_at", ascending: false }
  });
}

async function getFeaturedArticles(limit = 3) {
  return fetchTable("articles", {
    orderBy: { column: "created_at", ascending: false },
    limit
  });
}

async function getStats() {
  const { data } = await supabaseClient.from("stats").select("*").single();
  return data;
}

async function incrementResource(resourceKey) {
  await supabaseClient.rpc("increment_download", {
    resource_key: resourceKey
  });
}

async function incrementVisitors() {
  await supabaseClient.rpc("increment_visitors");
}


// MAKE FUNCTIONS GLOBAL
window.getUpdates = getUpdates;
window.getArticles = getArticles;
window.getFeaturedArticles = getFeaturedArticles;
window.getStats = getStats;
window.incrementResource = incrementResource;
window.incrementVisitors = incrementVisitors;