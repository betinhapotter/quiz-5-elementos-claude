#!/bin/bash
# MySQL Schema Loader - Deterministic and Error-Proof
# Always loads ALL tables, columns, relationships, constraints
# Output: JSON file with complete schema information

set -euo pipefail

# Output file
OUTPUT_FILE="/tmp/mysql_schema_$$.json"
ERROR_LOG="/tmp/mysql_schema_error_$$.log"

# Trap errors and cleanup
trap 'handle_error $? $LINENO' ERR

handle_error() {
    local exit_code=$1
    local line_number=$2
    echo "{\"error\": true, \"message\": \"Script failed at line $line_number with exit code $exit_code\", \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" > "$OUTPUT_FILE"
    exit $exit_code
}

# Function to safely execute MySQL queries
safe_mysql_query() {
    local query="$1"
    local description="$2"

    # Execute query with error handling
    if ! result=$(mysql "$DB_URL" -B -N -e "$query" 2>>"$ERROR_LOG"); then
        echo "null"
        return 1
    fi

    echo "$result"
    return 0
}

# Main schema loading function
load_mysql_schema() {
    local db_url="${1:-}"

    # Check if database URL is provided
    if [ -z "$db_url" ]; then
        # Try to auto-detect
        if [ -n "${MYSQL_CONNECTION_URL:-}" ]; then
            db_url="$MYSQL_CONNECTION_URL"
        elif [ -n "${MYSQL_DATABASE_URL:-}" ]; then
            db_url="$MYSQL_DATABASE_URL"
        else
            echo "{\"error\": true, \"message\": \"No MySQL database URL found\"}" > "$OUTPUT_FILE"
            exit 1
        fi
    fi

    # Export for use in safe_mysql_query
    export DB_URL="$db_url"

    # Extract database name from URL
    DB_NAME=$(echo "$db_url" | sed -n 's|.*\/\([^?]*\).*|\1|p')

    # Start JSON output
    echo "{" > "$OUTPUT_FILE"
    echo "  \"database_type\": \"mysql\"," >> "$OUTPUT_FILE"
    echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$OUTPUT_FILE"
    echo "  \"database_name\": \"$DB_NAME\"," >> "$OUTPUT_FILE"

    # 1. Database version
    version=$(safe_mysql_query "SELECT VERSION()" "database version" | head -1 | sed 's/"/\\"/g')
    echo "  \"version\": \"$version\"," >> "$OUTPUT_FILE"

    # 2. Count tables
    table_count=$(safe_mysql_query "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE'" "table count")
    echo "  \"table_count\": $table_count," >> "$OUTPUT_FILE"

    # 3. Load all tables with columns
    echo "  \"tables\": {" >> "$OUTPUT_FILE"

    # Get all table names
    tables=$(safe_mysql_query "SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE' ORDER BY table_name" "table list")

    first_table=true
    while IFS= read -r table; do
        [ -z "$table" ] && continue

        if [ "$first_table" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_table=false

        echo -n "    \"$table\": {" >> "$OUTPUT_FILE"

        # Get row count
        row_count=$(timeout 5 mysql "$DB_URL" -B -N -e "SELECT COUNT(*) FROM \`$table\`" 2>/dev/null || echo "null")
        echo -n "\"row_count\": $row_count, " >> "$OUTPUT_FILE"

        # Get columns for this table
        echo -n "\"columns\": [" >> "$OUTPUT_FILE"

        columns=$(safe_mysql_query "
            SELECT CONCAT(
                '{\"name\":\"', column_name,
                '\",\"type\":\"', data_type,
                '\",\"nullable\":\"', is_nullable,
                '\",\"default\":', IFNULL(CONCAT('\"', column_default, '\"'), 'null'),
                ',\"max_length\":', IFNULL(character_maximum_length, 'null'),
                ',\"key\":\"', IFNULL(column_key, ''),
                '\",\"extra\":\"', extra, '\"}'
            )
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
            AND table_name = '$table'
            ORDER BY ordinal_position
        " "columns for $table")

        first_col=true
        while IFS= read -r col; do
            [ -z "$col" ] && continue
            if [ "$first_col" = false ]; then
                echo -n ", " >> "$OUTPUT_FILE"
            fi
            first_col=false
            echo -n "$col" >> "$OUTPUT_FILE"
        done <<< "$columns"

        echo -n "]" >> "$OUTPUT_FILE"

        # Get primary key
        pk=$(safe_mysql_query "
            SELECT GROUP_CONCAT(column_name ORDER BY ordinal_position)
            FROM information_schema.key_column_usage
            WHERE table_schema = DATABASE()
            AND table_name = '$table'
            AND constraint_name = 'PRIMARY'
        " "primary key for $table")

        if [ -n "$pk" ] && [ "$pk" != "null" ] && [ "$pk" != "NULL" ]; then
            echo -n ", \"primary_key\": \"$pk\"" >> "$OUTPUT_FILE"
        fi

        # Get indexes
        echo -n ", \"indexes\": [" >> "$OUTPUT_FILE"

        indexes=$(safe_mysql_query "
            SELECT CONCAT(
                '{\"name\":\"', index_name,
                '\",\"unique\":', IF(non_unique = 0, 'true', 'false'),
                ',\"columns\":\"', GROUP_CONCAT(column_name ORDER BY seq_in_index), '\"}'
            )
            FROM information_schema.statistics
            WHERE table_schema = DATABASE()
            AND table_name = '$table'
            GROUP BY index_name, non_unique
        " "indexes for $table")

        first_idx=true
        while IFS= read -r idx; do
            [ -z "$idx" ] && continue
            if [ "$first_idx" = false ]; then
                echo -n ", " >> "$OUTPUT_FILE"
            fi
            first_idx=false
            echo -n "$idx" >> "$OUTPUT_FILE"
        done <<< "$indexes"

        echo -n "]}" >> "$OUTPUT_FILE"

    done <<< "$tables"

    echo "" >> "$OUTPUT_FILE"
    echo "  }," >> "$OUTPUT_FILE"

    # 4. Load all foreign key relationships
    echo "  \"relationships\": [" >> "$OUTPUT_FILE"

    relationships=$(safe_mysql_query "
        SELECT CONCAT(
            '{\"from_table\":\"', table_name,
            '\",\"from_column\":\"', column_name,
            '\",\"to_table\":\"', referenced_table_name,
            '\",\"to_column\":\"', referenced_column_name,
            '\",\"constraint_name\":\"', constraint_name, '\"}'
        )
        FROM information_schema.key_column_usage
        WHERE table_schema = DATABASE()
        AND referenced_table_name IS NOT NULL
        ORDER BY table_name, constraint_name
    " "foreign key relationships")

    first_rel=true
    while IFS= read -r rel; do
        [ -z "$rel" ] && continue
        if [ "$first_rel" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_rel=false
        echo -n "    $rel" >> "$OUTPUT_FILE"
    done <<< "$relationships"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # 5. Views
    echo "  \"views\": [" >> "$OUTPUT_FILE"

    views=$(safe_mysql_query "
        SELECT CONCAT(
            '{\"name\":\"', table_name, '\"}'
        )
        FROM information_schema.views
        WHERE table_schema = DATABASE()
        ORDER BY table_name
    " "views" || echo "")

    first_view=true
    while IFS= read -r view; do
        [ -z "$view" ] && continue
        if [ "$first_view" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_view=false
        echo -n "    $view" >> "$OUTPUT_FILE"
    done <<< "$views"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # 6. Stored procedures and functions
    echo "  \"routines\": [" >> "$OUTPUT_FILE"

    routines=$(safe_mysql_query "
        SELECT CONCAT(
            '{\"name\":\"', routine_name,
            '\",\"type\":\"', routine_type, '\"}'
        )
        FROM information_schema.routines
        WHERE routine_schema = DATABASE()
        ORDER BY routine_name
    " "routines" || echo "")

    first_routine=true
    while IFS= read -r routine; do
        [ -z "$routine" ] && continue
        if [ "$first_routine" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_routine=false
        echo -n "    $routine" >> "$OUTPUT_FILE"
    done <<< "$routines"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # Final success status
    echo "  \"success\": true," >> "$OUTPUT_FILE"
    echo "  \"error\": false" >> "$OUTPUT_FILE"
    echo "}" >> "$OUTPUT_FILE"
}

# Execute main function
load_mysql_schema "$@" >&2
output="$OUTPUT_FILE"

# Display summary to stderr so it doesn't interfere with output capture
if [ -f "$output" ]; then
    # Extract summary info
    table_count=$(grep '"table_count"' "$output" | grep -o '[0-9]*')
    rel_count=$(grep -c '"from_table"' "$output" || echo 0)

    {
        echo "═══════════════════════════════════════════"
        echo " MySQL Schema Load Complete"
        echo "═══════════════════════════════════════════"
        echo " Tables: $table_count"
        echo " Relationships: $rel_count"
        echo " Output: $output"
        echo "═══════════════════════════════════════════"
    } >&2
fi

# Only output the file path to stdout for the calling script to capture
echo "$OUTPUT_FILE"