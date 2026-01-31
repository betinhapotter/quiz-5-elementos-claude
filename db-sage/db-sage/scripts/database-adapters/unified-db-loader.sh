#!/bin/bash
# Unified Database Schema Loader
# Automatically detects database type and loads complete schema
# This is the SINGLE entry point for DB Sage activation
# Output: Standardized JSON schema + formatted summary

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Output files
SCHEMA_FILE="/tmp/db_schema_unified_$$.json"
DETECTION_FILE="/tmp/db_detection_$$.txt"
ERROR_LOG="/tmp/db_loader_error_$$.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Function to detect database type
detect_database_type() {
    # Check environment variables in priority order
    if [ -n "${SUPABASE_DB_URL:-}" ]; then
        echo "postgresql:supabase"
        echo "$SUPABASE_DB_URL" > "$DETECTION_FILE"
        return 0
    elif [ -n "${DATABASE_URL:-}" ]; then
        echo "postgresql:generic"
        echo "$DATABASE_URL" > "$DETECTION_FILE"
        return 0
    elif [ -n "${MYSQL_CONNECTION_URL:-}" ]; then
        echo "mysql"
        echo "$MYSQL_CONNECTION_URL" > "$DETECTION_FILE"
        return 0
    elif [ -n "${MYSQL_DATABASE_URL:-}" ]; then
        echo "mysql"
        echo "$MYSQL_DATABASE_URL" > "$DETECTION_FILE"
        return 0
    elif [ -n "${MONGODB_URI:-}" ]; then
        echo "mongodb"
        echo "$MONGODB_URI" > "$DETECTION_FILE"
        return 0
    else
        # Look for SQLite files
        for location in "outputs/database" "data" "."; do
            if [ -d "$location" ]; then
                db_file=$(find "$location" -maxdepth 3 \( -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" \) 2>/dev/null | head -1)
                if [ -n "$db_file" ] && [ -f "$db_file" ]; then
                    echo "sqlite"
                    echo "$db_file" > "$DETECTION_FILE"
                    return 0
                fi
            fi
        done
    fi

    echo "none"
    return 1
}

# Function to load schema based on database type
load_schema() {
    local db_type="$1"
    local db_connection="$2"
    local schema_output=""

    case "$db_type" in
        postgresql:supabase|postgresql:generic)
            echo -e "${BLUE}ℹ${NC} Loading PostgreSQL/Supabase schema..."
            if [ -x "$SCRIPT_DIR/postgresql-schema-loader.sh" ]; then
                schema_output=$("$SCRIPT_DIR/postgresql-schema-loader.sh" "$db_connection" 2>>"$ERROR_LOG")
            else
                echo -e "${RED}✗${NC} PostgreSQL loader script not found or not executable"
                return 1
            fi
            ;;

        mysql)
            echo -e "${BLUE}ℹ${NC} Loading MySQL schema..."
            if [ -x "$SCRIPT_DIR/mysql-schema-loader.sh" ]; then
                schema_output=$("$SCRIPT_DIR/mysql-schema-loader.sh" "$db_connection" 2>>"$ERROR_LOG")
            else
                echo -e "${RED}✗${NC} MySQL loader script not found or not executable"
                return 1
            fi
            ;;

        mongodb)
            echo -e "${BLUE}ℹ${NC} Loading MongoDB schema..."
            if [ -x "$SCRIPT_DIR/mongodb-schema-loader.sh" ]; then
                schema_output=$("$SCRIPT_DIR/mongodb-schema-loader.sh" "$db_connection" 2>>"$ERROR_LOG")
            else
                echo -e "${YELLOW}⚠${NC} MongoDB loader not yet implemented"
                echo "{\"error\": true, \"message\": \"MongoDB support coming soon\"}" > "$SCHEMA_FILE"
                return 1
            fi
            ;;

        sqlite)
            echo -e "${BLUE}ℹ${NC} Loading SQLite schema..."
            if [ -x "$SCRIPT_DIR/sqlite-schema-loader.sh" ]; then
                schema_output=$("$SCRIPT_DIR/sqlite-schema-loader.sh" "$db_connection" 2>>"$ERROR_LOG")
            else
                echo -e "${RED}✗${NC} SQLite loader script not found or not executable"
                return 1
            fi
            ;;

        *)
            echo -e "${RED}✗${NC} Unknown database type: $db_type"
            return 1
            ;;
    esac

    # Copy the schema output to unified location
    if [ -n "$schema_output" ] && [ -f "$schema_output" ]; then
        cp "$schema_output" "$SCHEMA_FILE"
        return 0
    else
        echo -e "${RED}✗${NC} Failed to load schema"
        return 1
    fi
}

# Function to display formatted summary
display_summary() {
    local schema_file="$1"

    # Check if jq is available for pretty JSON parsing
    if command -v jq &> /dev/null; then
        # Extract key information using jq
        db_type=$(jq -r '.database_type' "$schema_file" 2>/dev/null || echo "unknown")
        table_count=$(jq -r '.table_count' "$schema_file" 2>/dev/null || echo "0")
        success=$(jq -r '.success' "$schema_file" 2>/dev/null || echo "false")

        # Extract table names
        tables=$(jq -r '.tables | keys | join(", ")' "$schema_file" 2>/dev/null | head -c 100)
        if [ ${#tables} -eq 100 ]; then
            tables="${tables}..."
        fi

        # Count relationships
        rel_count=$(jq '.relationships | length' "$schema_file" 2>/dev/null || echo "0")

        # Count views
        view_count=$(jq '.views | length' "$schema_file" 2>/dev/null || echo "0")
    else
        # Fallback to grep if jq not available
        db_type=$(grep -o '"database_type":"[^"]*"' "$schema_file" | cut -d'"' -f4 || echo "unknown")
        table_count=$(grep -o '"table_count":[0-9]*' "$schema_file" | cut -d':' -f2 || echo "0")
        success=$(grep -o '"success":[a-z]*' "$schema_file" | cut -d':' -f2 || echo "false")
        rel_count=$(grep -c '"from_table"' "$schema_file" || echo "0")
        view_count=$(grep -c '"name".*"view"' "$schema_file" || echo "0")
        tables="[Use 'jq' for better table listing]"
    fi

    # Display formatted summary
    echo
    echo -e "${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║          DATABASE SCHEMA LOADED SUCCESSFULLY              ║${NC}"
    echo -e "${BOLD}╠═══════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BOLD}║${NC} ${CYAN}Database Type:${NC}  $db_type"
    echo -e "${BOLD}║${NC} ${CYAN}Tables:${NC}         $table_count"
    echo -e "${BOLD}║${NC} ${CYAN}Relationships:${NC}  $rel_count"
    echo -e "${BOLD}║${NC} ${CYAN}Views:${NC}          $view_count"
    echo -e "${BOLD}╠═══════════════════════════════════════════════════════════╣${NC}"
    echo -e "${BOLD}║${NC} ${GREEN}✓ Schema JSON:${NC}  $schema_file"
    echo -e "${BOLD}║${NC} ${GREEN}✓ Status:${NC}       Ready for DB Sage operations"
    echo -e "${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"

    # Export for DB Sage to use
    export DB_SCHEMA_FILE="$schema_file"
    export DB_SCHEMA_LOADED="true"
}

# Main execution
main() {
    echo -e "${BOLD}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}     UNIFIED DATABASE LOADER - Super Agentes Framework      ${NC}"
    echo -e "${BOLD}════════════════════════════════════════════════════════════${NC}"
    echo

    # Step 1: Detect database type
    echo -e "${CYAN}Step 1: Detecting database connection...${NC}"
    if db_type=$(detect_database_type); then
        db_connection=$(cat "$DETECTION_FILE")
        echo -e "${GREEN}✓${NC} Detected: ${BOLD}$db_type${NC}"
    else
        echo -e "${RED}✗${NC} No database connection found"
        echo
        echo -e "${YELLOW}Please set one of the following:${NC}"
        echo "  • SUPABASE_DB_URL    (PostgreSQL/Supabase)"
        echo "  • DATABASE_URL       (PostgreSQL)"
        echo "  • MYSQL_CONNECTION_URL (MySQL)"
        echo "  • MONGODB_URI        (MongoDB)"
        echo "  • Or place .db/.sqlite file in outputs/database/"
        exit 1
    fi

    # Step 2: Load schema
    echo
    echo -e "${CYAN}Step 2: Loading database schema...${NC}"
    if load_schema "$db_type" "$db_connection"; then
        echo -e "${GREEN}✓${NC} Schema loaded successfully"
    else
        echo -e "${RED}✗${NC} Failed to load schema"
        [ -f "$ERROR_LOG" ] && echo -e "${YELLOW}Error log: $ERROR_LOG${NC}"
        exit 1
    fi

    # Step 3: Display summary
    echo
    echo -e "${CYAN}Step 3: Processing results...${NC}"
    if [ -f "$SCHEMA_FILE" ]; then
        display_summary "$SCHEMA_FILE"

        # Create a marker file for DB Sage
        echo "$db_type" > /tmp/db_sage_ready_$$
        echo "$SCHEMA_FILE" >> /tmp/db_sage_ready_$$

        echo
        echo -e "${GREEN}${BOLD}✓ Database context loaded and ready for DB Sage!${NC}"
        echo -e "${BLUE}ℹ${NC} Use ${BOLD}*help${NC} to see available database commands"
    else
        echo -e "${RED}✗${NC} Schema file not found"
        exit 1
    fi
}

# Run main function
main "$@"