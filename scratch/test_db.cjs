const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://eeipkcmponipjorrsmnr.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaXBrY21wb25pcGpvcnJzbW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTg2OTUsImV4cCI6MjA5MzY3NDY5NX0.HxH8nH338UylFviUm3l9WVL5jrSWgJmaqm983zoSYbY";

const supabase = createClient(SUPABASE_URL, ANON_KEY);

async function test() {
  const testPayload = {
    customer_name: "Anon Guest Test",
    phone: "+21658829700",
    address: "Rue Tarek Ibn Zied",
    city: "Monastir",
    notes: null,
    items: [
      {
        product_id: "55262e4c-25bb-4b8b-8b13-df2bfe3c4139",
        slug: "series-reve",
        name: "Series Rêve",
        price: 98,
        quantity: 2,
        imageKey: "test",
      }
    ],
    total: 105,
    status: "pending",
    user_id: null
  };

  console.log("Trying guest insert with ANON client...");
  const { data, error } = await supabase
    .from("orders")
    .insert(testPayload)
    .select("id");
    
  if (error) {
    console.error("❌ Guest insert FAILED:", error.message);
  } else {
    console.log("✅ Guest insert SUCCESSFUL! Created ID:", data[0]?.id);
    
    // Clean up using service_role via a separate client
    const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaXBrY21wb25pcGpvcnJzbW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTg2OTUsImV4cCI6MjA5MzY3NDY5NX0.3lGdmoKTlC9AoArQ6ScRMSyNodc9L0X4BDEdjgkP6mU";
    const adminSupabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    await adminSupabase.from("orders").delete().eq("id", data[0]?.id);
    console.log("Test row cleaned up successfully.");
  }
}

test().catch(console.error);
