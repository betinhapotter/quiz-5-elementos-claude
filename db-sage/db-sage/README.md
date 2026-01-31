# 🗄️ DB Sage - Database Architect & Operations Engineer

**Version:** 1.1.0
**Command:** `/db-sage`
**Type:** Specialist Agent
**Independence:** Requires PostgreSQL/Supabase

---

## Prerequisites

> **IMPORTANT:** This expansion pack requires a PostgreSQL database or Supabase project.

### Required

| Dependency | Version | Purpose | Install |
|------------|---------|---------|---------|
| **PostgreSQL** | >= 13.0 | Database server | [postgresql.org/download](https://www.postgresql.org/download/) |
| **psql** | - | PostgreSQL CLI client | Included with PostgreSQL |

### Optional (for Supabase users)

| Dependency | Version | Purpose | Install |
|------------|---------|---------|---------|
| **Supabase CLI** | >= 1.0 | Supabase project management | `npm install -g supabase` |

### Environment Variables

```bash
# Option 1: Raw PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Option 2: Supabase
export SUPABASE_DB_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
export SUPABASE_PROJECT_REF="your-project-ref"
```

---

## Overview

DB Sage is an expert database agent specializing in:

- **Schema Design:** Domain modeling, table design, relationships
- **Migrations:** Safe migration planning, dry-runs, rollbacks
- **RLS Policies:** Row-Level Security for Supabase/PostgreSQL
- **Performance:** Query optimization, index strategy, hotpath analysis
- **Operations:** Backups, snapshots, seeding, smoke tests

---

## Quick Start

```bash
# 1. Activate DB Sage
/db-sage

# 2. Check environment
*env-check

# 3. Start designing
*domain-modeling
```

---

## Commands

### Architecture & Design

| Command | Description |
|---------|-------------|
| `*domain-modeling` | Design domain model from requirements |
| `*schema-audit` | Audit existing schema for issues |
| `*create-schema` | Generate schema from domain model |

### Migrations

| Command | Description |
|---------|-------------|
| `*dry-run {path}` | Validate migration without applying |
| `*apply-migration {path}` | Apply migration safely |
| `*rollback {snapshot}` | Rollback to snapshot |
| `*snapshot {name}` | Create rollback point |
| `*verify-order` | Validate DDL ordering |

### RLS & Security (Supabase)

| Command | Description |
|---------|-------------|
| `*rls-audit` | Audit RLS policies |
| `*policy-apply {table} {mode}` | Apply RLS policy |
| `*impersonate {user_id}` | Test as specific user |

### Performance

| Command | Description |
|---------|-------------|
| `*explain {query}` | Analyze query plan |
| `*analyze-hotpaths` | Find performance bottlenecks |
| `*query-optimization` | Optimize slow queries |

### Operations

| Command | Description |
|---------|-------------|
| `*env-check` | Validate environment setup |
| `*bootstrap` | Initialize new project |
| `*seed {file}` | Load seed data |
| `*smoke-test {version}` | Run smoke tests |
| `*load-csv {file} {table}` | Import CSV data |
| `*run-sql {query}` | Execute SQL |

### Supabase-Specific

| Command | Description |
|---------|-------------|
| `*supabase-setup` | Configure Supabase project |
| `*squad-integration` | Integrate with AIOS packs |

---

## Workflows

### 1. Setup Database (New Project)

```yaml
workflow: setup-database-workflow
steps:
  1. *env-check           # Validate environment
  2. *bootstrap           # Initialize project
  3. *domain-modeling     # Design domain
  4. *create-schema       # Generate schema
  5. *supabase-setup      # Configure Supabase (if using)
  6. *smoke-test v1       # Verify setup
```

### 2. Modify Schema (Existing Project)

```yaml
workflow: modify-schema-workflow
steps:
  1. *snapshot before-change
  2. *dry-run migration.sql
  3. *apply-migration migration.sql
  4. *smoke-test
  5. # If failed: *rollback before-change
```

### 3. Performance Tuning

```yaml
workflow: performance-tuning-workflow
steps:
  1. *analyze-hotpaths
  2. *explain "slow query"
  3. *query-optimization
  4. *create-indexes
  5. *smoke-test
```

---

## Project Structure

```
squads/db-sage/
├── agents/
│   ├── db-sage.md              # Main agent definition
│   ├── db-sage.yaml            # Agent config
│   └── db-sage-activation-protocol.md
├── tasks/                       # 26 database tasks
│   ├── db-*.md                  # Database operations
│   ├── domain-modeling.md
│   ├── query-optimization.md
│   └── schema-audit.md
├── templates/                   # 9 templates
│   ├── db-schema-design-tmpl.yaml
│   ├── db-migration-plan-tmpl.yaml
│   ├── db-rls-policies-tmpl.yaml
│   └── ...
├── checklists/                  # 7 checklists
│   ├── database-design-checklist.md
│   ├── dba-predeploy-checklist.md
│   └── ...
├── data/                        # 6 knowledge base files
│   ├── database-best-practices.md
│   ├── supabase-patterns.md
│   ├── rls-security-patterns.md
│   └── ...
├── workflows/                   # 7 workflow orchestrations
│   ├── setup-database-workflow.yaml
│   ├── modify-schema-workflow.yaml
│   └── ...
├── docs/
│   ├── stories/                 # Development stories
│   ├── epics/                   # Epic definitions
│   └── research/                # Research notes
├── scripts/
│   └── database-operations/     # Shell scripts
├── config.yaml
└── README.md
```

---

## Knowledge Base

| File | Description |
|------|-------------|
| `database-best-practices.md` | UUID PKs, timestamps, soft deletes, indexing |
| `supabase-patterns.md` | Supabase-specific patterns and idioms |
| `rls-security-patterns.md` | Row-Level Security patterns |
| `postgres-tuning-guide.md` | PostgreSQL performance tuning |
| `migration-safety-guide.md` | Safe migration practices |
| `migration-pitfalls.md` | Common migration mistakes |

---

## RLS Policy Examples

### KISS Policy (Simple)

```sql
-- Single policy for all operations
CREATE POLICY "users_own_data" ON my_table
  FOR ALL
  USING (user_id = auth.uid());
```

### Granular Policies

```sql
-- Separate policies per operation
CREATE POLICY "select_own" ON my_table FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "insert_own" ON my_table FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "update_own" ON my_table FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "delete_own" ON my_table FOR DELETE USING (user_id = auth.uid());
```

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Supabase connection
psql $SUPABASE_DB_URL -c "SELECT current_database()"
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `connection refused` | Database not running | Start PostgreSQL service |
| `password authentication failed` | Wrong credentials | Check DATABASE_URL |
| `relation does not exist` | Table not created | Run migrations |
| `permission denied` | RLS blocking | Check policies with `*rls-audit` |

---

## Integration with AIOS

DB Sage integrates with other expansion packs:

- **MMOS:** Database schema for cognitive clones
- **CreatorOS:** Course content database
- **BookSummary:** Book summaries storage

Use `*squad-integration` to configure.

---

## Security Notes

- Never commit `.env` files with credentials
- Use connection pooling for production
- Enable SSL for remote connections
- Audit RLS policies regularly with `*rls-audit`
- Create snapshots before destructive operations

---

**Maintained By:** AIOS Team
**Last Updated:** 2026-01-22
**Independence:** Requires PostgreSQL/Supabase
