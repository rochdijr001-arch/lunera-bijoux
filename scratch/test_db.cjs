const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://eeipkcmponipjorrsmnr.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlaXBrY21wb25pcGpvcnJzbW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwOTg2OTUsImV4cCI6MjA5MzY3NDY5NX0.HxH8nH338UylFviUm3l9WVL5jrSWgJmaqm983zoSYbY";

async function test() {
  // 1. Create a client with Anon Key
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  // 2. Sign in as the admin user we created earlier (admin@lunera.com / LuneraAdmin2026!)
  console.log("Signing in as admin@lunera.com...");
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: "admin@lunera.com",
    password: "LuneraAdmin2026!",
  });

  if (authErr) {
    console.error("❌ Auth sign-in failed:", authErr.message);
    return;
  }

  console.log("✅ Authenticated successfully! User ID:", authData.user.id);

  // 3. Try to insert order using the authenticated client
  const testPayload = {
    customer_name: "Authenticated Test",
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
    user_id: authData.user.id // Include authenticated user ID
  };

  console.log("Trying insert with AUTHENTICATED client...");
  const { data, error } = await supabase
    .from("orders")
    .insert(testPayload)
    .select("id");

  if (error) {
    console.error("❌ Insert with AUTHENTICATED client FAILED:");
    console.error("Error Message:", error.message);
    console.error("Code:", error.code);
  } else {
    console.log("✅ Insert with AUTHENTICATED client SUCCESSFUL! Created ID:", data[0]?.id);
    
    // Cleanup
    const { error: delErr } = await supabase.from("orders").delete().eq("id", data[0]?.id);
    console.log("Cleanup status:", delErr ? delErr.message : "Success");
  }
}

test().catch(console.error);
