#!/bin/bash
# Database Detection and Connection Script
# Part of Super Agentes Framework - AIOS
# Detects available database connections and provides unified interface

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detection result file
DETECTION_RESULT="/tmp/db_detection_$$.json"

# Function to detect database connections
detect_database() {
    local db_type="none"
    local db_url=""
    local db_name=""
    local db_host=""
    local db_port=""

    # Priority order: Supabase > PostgreSQL > MySQL > MongoDB > SQLite

    if [ -n "${SUPABASE_DB_URL:-}" ]; then
        db_type="postgresql"
        db_url="$SUPABASE_DB_URL"
        db_name="supabase"
        echo -e "${GREEN}✓${NC} Found SUPABASE_DB_URL (PostgreSQL/Supabase)"

    elif [ -n "${DATABASE_URL:-}" ]; then
        db_type="postgresql"
        db_url="$DATABASE_URL"
        db_name="postgresql"
        echo -e "${GREEN}✓${NC} Found DATABASE_URL (PostgreSQL)"

    elif [ -n "${MYSQL_CONNECTION_URL:-}" ]; then
        db_type="mysql"
        db_url="$MYSQL_CONNECTION_URL"
        db_name="mysql"
        echo -e "${GREEN}✓${NC} Found MYSQL_CONNECTION_URL (MySQL)"

    elif [ -n "${MONGODB_URI:-}" ]; then
        db_type="mongodb"
        db_url="$MONGODB_URI"
        db_name="mongodb"
        echo -e "${GREEN}✓${NC} Found MONGODB_URI (MongoDB)"

    else
        # Check for SQLite files
        echo -e "${YELLOW}⚠${NC} No connection URL found, checking for SQLite files..."

        # Look for SQLite files in common locations
        for location in "outputs/database" "data" "."; do
            if [ -d "$location" ]; then
                sqlite_file=$(find "$location" -maxdepth 2 \( -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" \) 2>/dev/null | head -1)
                if [ -n "$sqlite_file" ]; then
                    db_type="sqlite"
                    db_url="$sqlite_file"
                    db_name="sqlite"
                    echo -e "${GREEN}✓${NC} Found SQLite database: $sqlite_file"
                    break
                fi
            fi
        done
    fi

    # Write detection result to JSON file
    cat > "$DETECTION_RESULT" <<EOF
{
    "db_type": "$db_type",
    "db_url": "$db_url",
    "db_name": "$db_name",
    "detected_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

    # Return detection result
    if [ "$db_type" = "none" ]; then
        echo -e "${RED}✗${NC} No database connection detected"
        echo -e "${BLUE}ℹ${NC} Please set one of the following environment variables:"
        echo "  - SUPABASE_DB_URL (for Supabase)"
        echo "  - DATABASE_URL (for PostgreSQL)"
        echo "  - MYSQL_CONNECTION_URL (for MySQL)"
        echo "  - MONGODB_URI (for MongoDB)"
        echo "  Or place a .db/.sqlite file in outputs/database/"
        return 1
    fi

    return 0
}

# Function to test database connection
test_connection() {
    local db_type="$1"
    local db_url="$2"

    echo -e "${BLUE}ℹ${NC} Testing connection..."

    case "$db_type" in
        postgresql)
            if psql "$db_url" -c "SELECT 1" >/dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} Connection successful"
                return 0
            else
                echo -e "${RED}✗${NC} Connection failed"
                return 1
            fi
            ;;

        mysql)
            if mysql "$db_url" -e "SELECT 1" >/dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} Connection successful"
                return 0
            else
                echo -e "${RED}✗${NC} Connection failed"
                return 1
            fi
            ;;

        mongodb)
            if mongosh "$db_url" --quiet --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
                echo -e "${GREEN}✓${NC} Connection successful"
                return 0
            else
                echo -e "${RED}✗${NC} Connection failed"
                return 1
            fi
            ;;

        sqlite)
            if [ -f "$db_url" ]; then
                if sqlite3 "$db_url" "SELECT 1" >/dev/null 2>&1; then
                    echo -e "${GREEN}✓${NC} Connection successful"
                    return 0
                else
                    echo -e "${RED}✗${NC} Connection failed"
                    return 1
                fi
            else
                echo -e "${RED}✗${NC} SQLite file not found: $db_url"
                return 1
            fi
            ;;

        *)
            echo -e "${RED}✗${NC} Unknown database type: $db_type"
            return 1
            ;;
    esac
}

# Main execution
main() {
    echo "════════════════════════════════════════════"
    echo " Database Detection - Super Agentes Framework"
    echo "════════════════════════════════════════════"
    echo

    # Detect database
    if detect_database; then
        # Read detection result
        db_type=$(grep '"db_type"' "$DETECTION_RESULT" | cut -d'"' -f4)
        db_url=$(grep '"db_url"' "$DETECTION_RESULT" | cut -d'"' -f4)

        # Test connection
        if test_connection "$db_type" "$db_url"; then
            echo
            echo -e "${GREEN}Database ready for use!${NC}"
            echo "Detection result saved to: $DETECTION_RESULT"
        else
            echo
            echo -e "${YELLOW}⚠ Database detected but connection failed${NC}"
            echo "Please check your credentials and network connection"
            exit 1
        fi
    else
        exit 1
    fi
}

# Run main function
main "$@"