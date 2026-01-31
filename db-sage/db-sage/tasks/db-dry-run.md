# Task: Migration Dry-Run

**Purpose**: Execute migration inside BEGIN…ROLLBACK to catch syntax/ordering errors

**Elicit**: true

---

## 🚀 NEW: Use Automated Migration Safe Runner (RECOMMENDED)

**Token Savings: 91% | Time Savings: ~88%**

```bash
# Dry-run migration with automatic error detection
./squads/super-agentes/scripts/database-operations/migration-safe-runner.sh {path} --dry-run

# Dry-run with DDL validation
./squads/super-agentes/scripts/database-operations/migration-safe-runner.sh {path} --dry-run --validate-ddl

# Dry-run with dependency order verification
./squads/super-agentes/scripts/database-operations/migration-safe-runner.sh {path} --dry-run --verify-order

# Benefits:
#   - Automatic syntax validation
#   - Dependency order checking
#   - Pre/post snapshot comparison
#   - Rollback script validation
#   - 91% token savings
```

**OR continue with manual dry-run below:**

---

## Inputs

- `path` (string): Path to SQL migration file

---

## Process

### 1. Confirm Migration File

Ask user to confirm:
- Migration file path: `{path}`
- Purpose of this migration
- Expected changes (tables, functions, etc)

### 2. Execute Dry-Run

Run migration in transaction that will be rolled back:

```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 <<'SQL'
BEGIN;
\echo 'Starting dry-run...'
\i {path}
\echo 'Dry-run completed successfully - rolling back...'
ROLLBACK;
SQL
```

### 3. Report Results

**If successful:**
```
✓ Dry-run completed without errors
✓ Migration syntax is valid
✓ No dependency or ordering issues detected
```

**If failed:**
```
❌ Dry-run failed
Error: [error message]
Line: [line number if available]
Fix the migration and try again
```

---

## What This Validates

- ✅ SQL syntax correctness
- ✅ Object dependencies exist
- ✅ Execution order is valid
- ✅ No constraint violations
- ❌ Does NOT validate data correctness
- ❌ Does NOT check performance

---

## Next Steps After Success

1. Review migration one more time
2. Take snapshot: `*snapshot pre_migration`
3. Apply migration: `*apply-migration {path}`
4. Run smoke tests: `*smoke-test`

---

## Error Handling

Common errors and fixes:

**"relation does not exist"**
- Missing table/view dependency
- Check if you need to create dependent objects first

**"function does not exist"**
- Function called before creation
- Reorder: tables → functions → triggers

**"syntax error"**
- Check SQL syntax
- Verify PostgreSQL version compatibility
