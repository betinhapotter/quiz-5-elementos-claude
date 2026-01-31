#!/bin/bash
# SQLite Schema Loader - Deterministic and Error-Proof
# Always loads ALL tables, columns, relationships, constraints
# Output: JSON file with complete schema information

set -euo pipefail

# Output file
OUTPUT_FILE="/tmp/sqlite_schema_$$.json"
ERROR_LOG="/tmp/sqlite_schema_error_$$.log"

# Trap errors and cleanup
trap 'handle_error $? $LINENO' ERR

handle_error() {
    local exit_code=$1
    local line_number=$2
    echo "{\"error\": true, \"message\": \"Script failed at line $line_number with exit code $exit_code\", \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}" > "$OUTPUT_FILE"
    exit $exit_code
}

# Function to safely execute SQLite queries
safe_sqlite_query() {
    local db_file="$1"
    local query="$2"
    local description="$3"

    # Execute query with error handling
    if ! result=$(sqlite3 "$db_file" "$query" 2>>"$ERROR_LOG"); then
        echo "null"
        return 1
    fi

    echo "$result"
    return 0
}

# Function to find SQLite database file
find_sqlite_file() {
    # Check if file path is provided
    if [ -n "${1:-}" ] && [ -f "$1" ]; then
        echo "$1"
        return 0
    fi

    # Search for SQLite files in common locations
    for location in "outputs/database" "data" "."; do
        if [ -d "$location" ]; then
            db_file=$(find "$location" -maxdepth 3 \( -name "*.db" -o -name "*.sqlite" -o -name "*.sqlite3" \) 2>/dev/null | head -1)
            if [ -n "$db_file" ] && [ -f "$db_file" ]; then
                echo "$db_file"
                return 0
            fi
        fi
    done

    return 1
}

# Main schema loading function
load_sqlite_schema() {
    local db_file="${1:-}"

    # Find database file
    if ! db_file=$(find_sqlite_file "$db_file"); then
        echo "{\"error\": true, \"message\": \"No SQLite database file found\"}" > "$OUTPUT_FILE"
        exit 1
    fi

    # Verify it's a valid SQLite database
    if ! file "$db_file" | grep -q "SQLite"; then
        echo "{\"error\": true, \"message\": \"File is not a valid SQLite database: $db_file\"}" > "$OUTPUT_FILE"
        exit 1
    fi

    # Start JSON output
    echo "{" > "$OUTPUT_FILE"
    echo "  \"database_type\": \"sqlite\"," >> "$OUTPUT_FILE"
    echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"," >> "$OUTPUT_FILE"
    echo "  \"database_file\": \"$db_file\"," >> "$OUTPUT_FILE"
    # Get file size (macOS and Linux compatible)
    if [ "$(uname)" = "Darwin" ]; then
        file_size=$(stat -f%z "$db_file" 2>/dev/null || echo 0)
    else
        file_size=$(stat -c%s "$db_file" 2>/dev/null || echo 0)
    fi
    echo "  \"file_size\": $file_size," >> "$OUTPUT_FILE"

    # 1. Database version
    version=$(safe_sqlite_query "$db_file" "SELECT sqlite_version()" "database version")
    echo "  \"version\": \"$version\"," >> "$OUTPUT_FILE"

    # 2. Count tables
    table_count=$(safe_sqlite_query "$db_file" "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'" "table count")
    echo "  \"table_count\": $table_count," >> "$OUTPUT_FILE"

    # 3. Load all tables with columns
    echo "  \"tables\": {" >> "$OUTPUT_FILE"

    # Get all table names
    tables=$(safe_sqlite_query "$db_file" "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name" "table list")

    first_table=true
    while IFS= read -r table; do
        [ -z "$table" ] && continue

        if [ "$first_table" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_table=false

        echo -n "    \"$table\": {" >> "$OUTPUT_FILE"

        # Get row count
        row_count=$(timeout 5 sqlite3 "$db_file" "SELECT COUNT(*) FROM \"$table\"" 2>/dev/null || echo "null")
        echo -n "\"row_count\": $row_count, " >> "$OUTPUT_FILE"

        # Get columns for this table using PRAGMA
        echo -n "\"columns\": [" >> "$OUTPUT_FILE"

        # Use pragma_table_info to get column details (CSV format for compatibility)
        columns=$(safe_sqlite_query "$db_file" "PRAGMA table_info('$table')" "columns for $table")

        first_col=true
        while IFS='|' read -r cid name type notnull dflt_value pk; do
            [ -z "$name" ] && continue

            if [ "$first_col" = false ]; then
                echo -n ", " >> "$OUTPUT_FILE"
            fi
            first_col=false

            # Convert notnull to nullable
            nullable="true"
            [ "$notnull" = "1" ] && nullable="false"

            # Handle primary key
            is_pk="false"
            [ "$pk" != "0" ] && is_pk="true"

            # Handle default value
            default="null"
            [ -n "$dflt_value" ] && [ "$dflt_value" != "" ] && default="\"$dflt_value\""

            echo -n "{\"name\":\"$name\",\"type\":\"$type\",\"nullable\":$nullable,\"default\":$default,\"primary_key\":$is_pk}" >> "$OUTPUT_FILE"
        done <<< "$columns"

        echo -n "]" >> "$OUTPUT_FILE"

        # Get primary key columns
        pk_cols=$(safe_sqlite_query "$db_file" "
            SELECT GROUP_CONCAT(name)
            FROM pragma_table_info('$table')
            WHERE pk > 0
            ORDER BY pk
        " "primary key for $table")

        if [ -n "$pk_cols" ] && [ "$pk_cols" != "null" ]; then
            echo -n ", \"primary_key\": \"$pk_cols\"" >> "$OUTPUT_FILE"
        fi

        # Get indexes
        echo -n ", \"indexes\": [" >> "$OUTPUT_FILE"

        indexes=$(safe_sqlite_query "$db_file" "
            SELECT name FROM sqlite_master
            WHERE type='index'
            AND tbl_name='$table'
            AND sql IS NOT NULL
            ORDER BY name
        " "indexes for $table")

        first_idx=true
        while IFS= read -r idx_name; do
            [ -z "$idx_name" ] && continue

            # Get index info
            idx_info=$(safe_sqlite_query "$db_file" "PRAGMA index_info('$idx_name')" "index info for $idx_name")
            idx_sql=$(safe_sqlite_query "$db_file" "SELECT sql FROM sqlite_master WHERE type='index' AND name='$idx_name'" "index sql")

            if [ "$first_idx" = false ]; then
                echo -n ", " >> "$OUTPUT_FILE"
            fi
            first_idx=false

            # Check if unique
            is_unique="false"
            if echo "$idx_sql" | grep -q "UNIQUE"; then
                is_unique="true"
            fi

            echo -n "{\"name\":\"$idx_name\",\"unique\":$is_unique,\"sql\":\"$(echo "$idx_sql" | sed 's/"/\\"/g')\"}" >> "$OUTPUT_FILE"
        done <<< "$indexes"

        echo -n "]" >> "$OUTPUT_FILE"

        # Get table SQL for additional info
        table_sql=$(safe_sqlite_query "$db_file" "SELECT sql FROM sqlite_master WHERE type='table' AND name='$table'" "table sql")
        if [ -n "$table_sql" ] && [ "$table_sql" != "null" ]; then
            echo -n ", \"create_sql\": \"$(echo "$table_sql" | sed 's/"/\\"/g' | tr '\n' ' ')\"" >> "$OUTPUT_FILE"
        fi

        echo -n "}" >> "$OUTPUT_FILE"

    done <<< "$tables"

    echo "" >> "$OUTPUT_FILE"
    echo "  }," >> "$OUTPUT_FILE"

    # 4. Load all foreign key relationships
    echo "  \"relationships\": [" >> "$OUTPUT_FILE"

    # Enable foreign key support and get all foreign keys
    fk_list=$(safe_sqlite_query "$db_file" "PRAGMA foreign_keys = ON" "enable foreign keys")

    first_rel=true
    while IFS= read -r table; do
        [ -z "$table" ] && continue

        # Get foreign keys for each table
        fks=$(safe_sqlite_query "$db_file" "PRAGMA foreign_key_list('$table')" "foreign keys for $table")

        if [ -n "$fks" ] && [ "$fks" != "null" ] && [ "$fks" != "" ]; then
            # Parse foreign key info (format: id|seq|table|from|to|on_update|on_delete|match)
            echo "$fks" | while IFS='|' read -r id seq ref_table from_col to_col on_update on_delete match; do
                if [ "$first_rel" = false ]; then
                    echo "," >> "$OUTPUT_FILE"
                fi
                first_rel=false

                echo -n "    {\"from_table\":\"$table\",\"from_column\":\"$from_col\",\"to_table\":\"$ref_table\",\"to_column\":\"$to_col\"}" >> "$OUTPUT_FILE"
            done
        fi
    done <<< "$tables"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # 5. Views
    echo "  \"views\": [" >> "$OUTPUT_FILE"

    views=$(safe_sqlite_query "$db_file" "SELECT name FROM sqlite_master WHERE type='view' ORDER BY name" "views")

    first_view=true
    while IFS= read -r view; do
        [ -z "$view" ] && continue

        view_sql=$(safe_sqlite_query "$db_file" "SELECT sql FROM sqlite_master WHERE type='view' AND name='$view'" "view sql")

        if [ "$first_view" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_view=false

        echo -n "    {\"name\":\"$view\",\"sql\":\"$(echo "$view_sql" | sed 's/"/\\"/g' | tr '\n' ' ')\"}" >> "$OUTPUT_FILE"
    done <<< "$views"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # 6. Triggers
    echo "  \"triggers\": [" >> "$OUTPUT_FILE"

    triggers=$(safe_sqlite_query "$db_file" "SELECT name, tbl_name FROM sqlite_master WHERE type='trigger' ORDER BY name" "triggers")

    first_trigger=true
    while IFS='|' read -r trigger_name table_name; do
        [ -z "$trigger_name" ] && continue

        trigger_sql=$(safe_sqlite_query "$db_file" "SELECT sql FROM sqlite_master WHERE type='trigger' AND name='$trigger_name'" "trigger sql")

        if [ "$first_trigger" = false ]; then
            echo "," >> "$OUTPUT_FILE"
        fi
        first_trigger=false

        echo -n "    {\"name\":\"$trigger_name\",\"table\":\"$table_name\",\"sql\":\"$(echo "$trigger_sql" | sed 's/"/\\"/g' | tr '\n' ' ')\"}" >> "$OUTPUT_FILE"
    done <<< "$triggers"

    echo "" >> "$OUTPUT_FILE"
    echo "  ]," >> "$OUTPUT_FILE"

    # 7. Database pragmas
    echo "  \"pragmas\": {" >> "$OUTPUT_FILE"

    # Get various pragma settings
    journal_mode=$(safe_sqlite_query "$db_file" "PRAGMA journal_mode" "journal mode")
    encoding=$(safe_sqlite_query "$db_file" "PRAGMA encoding" "encoding")
    auto_vacuum=$(safe_sqlite_query "$db_file" "PRAGMA auto_vacuum" "auto vacuum")
    page_size=$(safe_sqlite_query "$db_file" "PRAGMA page_size" "page size")

    echo "    \"journal_mode\": \"$journal_mode\"," >> "$OUTPUT_FILE"
    echo "    \"encoding\": \"$encoding\"," >> "$OUTPUT_FILE"
    echo "    \"auto_vacuum\": $auto_vacuum," >> "$OUTPUT_FILE"
    echo "    \"page_size\": $page_size" >> "$OUTPUT_FILE"

    echo "  }," >> "$OUTPUT_FILE"

    # Final success status
    echo "  \"success\": true," >> "$OUTPUT_FILE"
    echo "  \"error\": false" >> "$OUTPUT_FILE"
    echo "}" >> "$OUTPUT_FILE"
}

# Execute main function
load_sqlite_schema "$@" >&2
output="$OUTPUT_FILE"

# Display summary to stderr so it doesn't interfere with output capture
if [ -f "$output" ]; then
    # Extract summary info
    table_count=$(grep '"table_count"' "$output" | grep -o '[0-9]*')
    rel_count=$(grep -c '"from_table"' "$output" || echo 0)
    db_file=$(grep '"database_file"' "$output" | cut -d'"' -f4)

    {
        echo "═══════════════════════════════════════════"
        echo " SQLite Schema Load Complete"
        echo "═══════════════════════════════════════════"
        echo " Database: $db_file"
        echo " Tables: $table_count"
        echo " Relationships: $rel_count"
        echo " Output: $output"
        echo "═══════════════════════════════════════════"
    } >&2
fi

# Only output the file path to stdout for the calling script to capture
echo "$OUTPUT_FILE"