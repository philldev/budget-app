import { db } from "./index";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Clearing database...");

  const tables = [
    "transactions",
    "budgets",
    "session",
    "account",
    "verification",
    "user",
  ];

  for (const table of tables) {
    try {
      console.log(`Dropping table: ${table}`);
      await db.run(sql.raw(`DROP TABLE IF EXISTS ${table}`));
    } catch (error) {
      console.error(`Failed to drop table ${table}:`, error);
    }
  }

  console.log("Database cleared successfully.");
}

main().catch((err) => {
  console.error("Failed to clear database:");
  console.error(err);
  process.exit(1);
});
