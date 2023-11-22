import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // ...
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // ...
    // Define environment variables for your tests
    "import.meta.env.SUPABASE_KEY": JSON.stringify(process.env.SUPABASE_KEY),
    "import.meta.env.SENDGRID_API_KEY": JSON.stringify(
      process.env.SUPABASE_KEY,
    ),
    "import.meta.env.TELEGRAM_BOT_TOKEN": JSON.stringify(
      process.env.SUPABASE_KEY,
    ),
    "import.meta.env.TELEGRAM_CHAT_ID": JSON.stringify(
      process.env.SUPABASE_KEY,
    ),
    "import.meta.env.SUPABASE_URL": JSON.stringify(process.env.SUPABASE_KEY),
  },
});
