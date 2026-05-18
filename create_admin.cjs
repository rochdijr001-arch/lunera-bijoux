const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing env vars. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createAdmin() {
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
  });

  if (userError) {
    console.error("Error creating user:", userError.message);
    return;
  }

  const userId = userData.user.id;
  console.log("✅ Admin user created with ID:", userId);

  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  if (roleError) {
    console.error("Error assigning admin role:", roleError.message);
    return;
  }

  console.log("✅ Admin role assigned successfully!");
  console.log("Admin email:", ADMIN_EMAIL);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
