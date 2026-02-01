# P0-002: Remove Anonymous Access in Leads SELECT

**Status**: ✅ Completed  
**Date**: 2026-02-01  
**Executed by**: Jaya + Claude

## What was done

Edited RLS policy on `leads` table in Supabase Dashboard:

- **Before**: `(auth.uid() = user_id) OR (auth.uid() IS NULL)`
- **After**: `auth.uid() = user_id`

## Why

- LGPD security: prevent anonymous email enumeration
- Only authenticated users can see their own leads

## Validation

- ✅ SQL query confirmed policy is active
- ✅ Manual testing passed

## Note

Policy changes are made in Supabase Dashboard, not tracked in git.
This file documents the change for audit trail.
