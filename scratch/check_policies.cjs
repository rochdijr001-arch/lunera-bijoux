const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://eeipkcmponipjorrsmnr.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaXBrY21wb25pcGpvcnJzbW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTg2OTUsImV4cCI6MjA5MzY3NDY5NX0.3lGdmoKTlC9AoArQ6ScRMSyNodc9L0X4BDEdjgkP6mU";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "pg_catalog" }
});

async function check() {
  console.log("Fetching policies for orders table...");
  const { data, error } = await supabase
    .from("pg_policies")
    .select("*")
    .eq("tablename", "orders");

  if (error) {
    console.error("❌ Error fetching policies:", error.message);
  } else {
    console.log("✅ Policies found:");
    console.log(JSON.stringify(data, null, 2));
  }
}

check().catch(console.error);
