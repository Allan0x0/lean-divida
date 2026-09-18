# Divida: code-pattern coverage

Goal: write each **distinct type of code** once. Once a pattern exists, building more
features that only reuse it is your job, not tracked here as new work.

Legend: ✅ covered (copy the example file) · ⬜ due · ♻️ reuse of a covered pattern (not new)

## Frontend: UI

| Pattern | Status | Example / where | Notes |
|---|---|---|---|
| Styled presentational component (`twMerge` + `ComponentProps`) | ✅ | `apps/web/src/components/Button.tsx`, `Card.tsx`, `CenteredView.tsx` | |
| `forwardRef` text input | ✅ | `apps/web/src/components/TextField.tsx` | |
| Static route | ✅ | `apps/web/src/routes/About.tsx` | |
| Single-object query route (loading / error / data) | ✅ | `apps/web/src/routes/Home.tsx` | |
| Auth form (refs + `safeParse` + mutation + error copy) | ✅ | `apps/web/src/routes/Login.tsx` | |
| List rendering (map array + empty + loading + error) | ⬜ | leads list route | Home renders one object; a list is a different shape. |
| Domain-field formatting (amount cents → currency, date) | ⬜ | leads list | `amount` is stored in minor units (cents). |
| Per-row action button with its own pending state | ⬜ | approve / reject on a lead row | Each row mutates independently. |
| `<select>` / dropdown input component | ⬜ | userType picker on register | `TextField` is text-only. |
| Per-field error surfacing (`getFieldErrors`) | ⬜ | register form | Login only used `issues[0]`; this maps server zod errors to each field. |
| Logout button + redirect | ⬜ | nav | `useLogout` exists, no trigger. |
| Nav / layout shell showing current user | ⬜ | app layout | |
| Role-conditional UI (admin-only controls) | ⬜ | leads / nav | Show/hide by `userType`. |

## Frontend: data

| Pattern | Status | Example / where | Notes |
|---|---|---|---|
| Query hook wrapper | ✅ | `apps/web/src/auth.ts` (`useAuth`) | |
| Mutation hook + cache invalidate | ✅ | `apps/web/src/auth.ts` (`useLogin`/`useRegister`) | |
| Token storage in localStorage | ✅ | `apps/web/src/token.ts` | |
| Auth header injection + 401 → logout | ✅ | `apps/web/src/main.tsx` | |
| Route guard (redirect if not authed) | ✅ | `apps/web/src/components/ProtectedRoute.tsx` | |
| Optimistic / manual cache update after mutation | ⬜ | approve lead updates list without refetch | Current hooks only `invalidate`. |
| Role-guard route (admin-only) | ⬜ | admin route | ProtectedRoute checks authed only, not role. |

## Backend

| Pattern | Status | Example / where | Notes |
|---|---|---|---|
| Zod schema incl. cross-field `refine` | ✅ | `packages/api/src/schema.ts` | |
| Public query | ✅ | `packages/api/src/router.ts` (`ping`, `currentUser`) | |
| Public write mutation (+ dup check + `TRPCError`) | ✅ | `router.ts` (`register`) | |
| Public read mutation (+ password compare) | ✅ | `router.ts` (`login`) | |
| Nested router organization | ✅ | `router.ts` (`health`, `auth`) | |
| JWT issue / verify | ✅ | `packages/api/src/auth.ts` | |
| Context from `Authorization` header | ✅ | `packages/api/src/context.ts` | |
| `errorFormatter` (zod flatten to client) | ✅ | `packages/api/src/trpc.ts` | |
| `protectedProcedure` actually used (reads `ctx.user`) | ⬜ | leads endpoints | Defined in `trpc.ts`, never used. |
| Query scoped to current user | ⬜ | officer sees own leads (`where officerId = ctx.user.id`) | |
| Role-authorized procedure (`adminProcedure`, FORBIDDEN if not ADMIN) | ⬜ | admin-only endpoints | New middleware next to `protectedProcedure`. |

## Data / infra

| Pattern | Status | Example / where | Notes |
|---|---|---|---|
| Prisma model | ✅ | `packages/api/prisma/schema.prisma` | |
| Prisma migration | ✅ | `packages/api/prisma/migrations/` | |
| Seed script | ✅ | `packages/api/prisma/seed.ts` | |

## Cross-cutting (due)

| Pattern | Status | Notes |
|---|---|---|
| Paginated list query + pager UI | ⬜ | One pattern spanning both layers. Pick cursor vs offset when you write it. |

## Reuse only (not new work)

These are features you'll build by copying a covered pattern. Listed so you don't
mistake them for new patterns:

- ♻️ Create-lead / approve / reject mutations → same as `register` (write mutation), wrapped in the new `protectedProcedure` / `adminProcedure` rows above.
- ♻️ Register page form scaffold → copy `Login.tsx`; only the new micro-rows (select input, per-field errors) are tracked above.
- ♻️ Protected leads-list query hook → same shape as `useAuth`.

## Known gaps / defects (block the app running end to end)

- [ ] `/leads` route does not exist, but `Login` `onSuccess` navigates there (`App.tsx`).
- [ ] `App.tsx` never uses `ProtectedRoute`; no route is actually guarded.
- [ ] `protectedProcedure` is defined but no endpoint uses it.
- [ ] `EmailSchema.max(20)` in `schema.ts` is too tight (`officer1@example.com` = 20 exactly; longer emails fail).

## Suggested order

1. Fix defects (unblock running): add `/leads` route, wire `ProtectedRoute` in `App.tsx`.
2. Backend auth enablers: use `protectedProcedure`, add `adminProcedure`, ctx.user-scoped leads query.
3. Leads endpoints (reuse write pattern) behind those procedures.
4. Frontend leads UI: list rendering, formatting, per-row actions, optimistic update, role-conditional UI.
5. Register page (reuse) with select input + per-field errors; logout button; nav shell.
6. Pagination once the list is real.
