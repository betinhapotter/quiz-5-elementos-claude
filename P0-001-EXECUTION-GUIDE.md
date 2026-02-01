# P0-001 Execution Guide: Add DELETE Policies

**Story:** P0-001: [BUGFIX] Adicionar DELETE policies em todas tabelas (DB-001)
**Branch:** `feature/technical-debt-p0-p1`
**Duration:** 15 minutes
**Risk:** Baixo

---

## QUICK SUMMARY

Adicionar 3 políticas de DELETE no Supabase para permitir que usuários deletem seus próprios dados (LGPD compliance).

**Files Created:**
- `supabase/migrations/20260131000004_p0_001_add_delete_policies.sql`

---

## STEP 1: Apply Migration

### Option A: Supabase Dashboard (Easiest - 2 min)

1. Open https://supabase.com
2. Log in to your project
3. Go to **SQL Editor**
4. Copy this SQL e execute:

```sql
-- DELETE policy for quiz_results
CREATE POLICY "Users can delete own quiz results"
  ON quiz_results FOR DELETE
  USING (auth.uid() = user_id);

-- DELETE policy for planners
CREATE POLICY "Users can delete own planners"
  ON planners FOR DELETE
  USING (auth.uid() = user_id);

-- DELETE policy for leads
CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  USING (auth.uid() = user_id);
```

5. Click **Run** ✅

### Option B: CLI (If using supabase local)

```bash
# Apply all pending migrations
supabase migration up

# Or apply only this one
psql "your-database-url" < supabase/migrations/20260131000004_p0_001_add_delete_policies.sql
```

---

## STEP 2: Verify Policies Created

**In Supabase Dashboard:**

1. Go to **Authentication > Policies** (or Database > quiz_results > Policies)
2. Verify 3 new DELETE policies are listed:
   - "Users can delete own quiz results"
   - "Users can delete own planners"
   - "Users can delete own leads"

✅ Each should show: `FOR DELETE USING (auth.uid() = user_id)`

---

## STEP 3: Manual Test

### Test Case 1: User can delete own record

1. In **SQL Editor**, run:

```sql
-- Get any quiz result
SELECT id, user_id FROM quiz_results LIMIT 1;
```

2. Copy the `id` and note the `user_id`

3. Create a test DELETE:

```sql
-- Try to delete as the owner (user_id matches)
DELETE FROM quiz_results
WHERE id = 'PASTE_ID_HERE'
  AND user_id = 'PASTE_USER_ID_HERE';

-- Should return: 1 row deleted ✅
```

### Test Case 2: User cannot delete another's record

```sql
-- Try to delete someone else's quiz result
DELETE FROM quiz_results
WHERE id = 'PASTE_ID_HERE'
  AND user_id = 'DIFFERENT_USER_ID';

-- Should return: 0 rows deleted (RLS blocked) ✅
```

### Test Case 3: All 3 tables work

Repeat test cases for:
- `planners` table
- `leads` table

---

## STEP 4: Acceptance Criteria Checklist

Mark these as DONE when verified:

- [ ] DELETE policy criada para quiz_results: `auth.uid() = user_id`
- [ ] DELETE policy criada para planners: `auth.uid() = user_id`
- [ ] DELETE policy criada para leads: `auth.uid() = user_id`
- [ ] Teste manual: usuário consegue deletar próprio quiz_result (1 row deleted ✅)
- [ ] Teste manual: usuário NÃO consegue deletar quiz de outro (0 rows - RLS blocked ✅)
- [ ] Migration rodou sem erros em dev ✅

---

## STEP 5: Application Test (Optional)

If you want to test from the frontend:

1. Log in as a test user
2. Complete a quiz (creates a `quiz_results` record)
3. Go to browser DevTools > Console and run:

```javascript
// Test if DELETE works via Supabase client
const { data, error } = await supabaseClient
  .from('quiz_results')
  .delete()
  .eq('id', 'some-quiz-id')

if (error) console.error('DELETE blocked:', error)
else console.log('DELETE succeeded:', data)
```

Should see: `DELETE succeeded` (if it's their own record)

---

## DONE? COMMIT & MOVE ON

When all criteria are checked ✅:

```bash
# Stage the changes
git add docs/ IMPLEMENTATION-KICKOFF.md

# Commit with story ID
git commit -m "P0-001: Add DELETE policies for LGPD compliance"

# Next story
echo "Move to P0-002: Remove anonymous access in leads SELECT"
```

---

## TROUBLESHOOTING

**Error: "Policy already exists"**
- Run in same SQL session:
  ```sql
  DROP POLICY IF EXISTS "Users can delete own quiz results" ON quiz_results;
  ```
  Then retry.

**Error: "table doesn't exist"**
- Make sure baseline migration (20260127000000) ran first
- Check Supabase > Stripe > Tables tab

**Delete returns 0 rows but user is owner**
- RLS might be disabled on the table
- Verify: `SELECT are_rls_enabled FROM information_schema.tables WHERE table_name = 'quiz_results'`
- Should show: `t` (true)

---

## NEXT STORY

Once P0-001 is DONE ✅:

**Move to P0-002:** Remove anonymous access in leads SELECT (30 min)
- File: Same dashboard, different SQL
- See: `docs/stories/epic-technical-debt.md` section P0-002

---

*Story: P0-001*
*Effort: 15 min*
*Difficulty: ⭐ Very Easy*
*Status: Ready to Execute*
