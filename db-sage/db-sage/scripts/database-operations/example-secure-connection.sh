#!/bin/bash
# Example: Using secure database connection

# Source the environment (sets PGHOST, PGPORT, PGDATABASE, PGUSER)
source "$(dirname "$0")/../.pgenv"

# Now psql uses .pgpass automatically (no password in command)
psql -c "SELECT current_database(), current_user, version();"

# Or use in scripts
psql << SQL
    SELECT count(*) as table_count
    FROM information_schema.tables
    WHERE table_schema = 'public';
SQL
