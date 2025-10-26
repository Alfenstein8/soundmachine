#!/bin/bash

# 1. Check if the database file exists. If it doesn't, this is the first run,
#    so we run the schema push/migration.

DB_PATH="/usr/src/app/database/local.db"

if [ ! -f "$DB_PATH" ]; then
  echo "Database file not found at $DB_PATH. Running Drizzle schema push..."
  # Use the correct bun run command for Drizzle push/migrate
  bun run db:push 
  echo "Schema push complete."
fi

# 2. Start the main application process.
#    Replace 'build/index.js' with the actual file your ENTRYPOINT/CMD runs.
echo "Starting Bun application..."
exec bun -b run build/index.js
