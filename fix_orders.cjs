const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing env vars. Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log(
    "Run the SQL in RUN_THIS_SQL.md from the Supabase SQL Editor. This script no longer stores secrets in the codebase.",
  );

  const { data, error } = await supabase.from("orders").select("id").limit(1);

  if (error) {
    console.error("Supabase connection check failed:", error.message);
    process.exit(1);
  }

  console.log("✅ Supabase connection OK. Orders query returned", data?.length ?? 0, "row(s).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
