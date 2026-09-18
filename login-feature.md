# Login feature

Summary of the login work on the `login-feature` branch.

## What it does

A user enters their email and password on `/login`. The app validates the input,
sends it to the backend, and on success stores a token and marks the user as
logged in. Wrong credentials show a friendly message instead of a raw error.

## How it works

1. **Frontend page** (`apps/web/src/routes/Login.tsx`): reads the email and
   password fields, validates them with `LoginSchema` before sending, and shows a
   readable message on bad input or a failed login.
2. **Login hook** (`apps/web/src/auth.ts`, `useLogin`): calls the backend, then on
   success saves the token and refreshes the current-user query.
3. **Backend endpoint** (`packages/api/src/router.ts`, `auth.login`): looks up the
   user by email, checks the password against the stored hash, and returns a JWT
   token. Bad email or password returns an `UNAUTHORIZED` error.
4. **Route** (`apps/web/src/App.tsx`): `/login` is registered.

## Files changed

- `apps/web/src/routes/Login.tsx`: the login page.
- `apps/web/src/App.tsx`: added the `/login` route.
- `packages/api/src/router.ts`: login endpoint returns a proper `UNAUTHORIZED`
  error on bad credentials.
- `packages/api/src/schema.ts`: raised the email max length from 20 to 50 so real
  emails fit.

## Not done yet

- **Redirect after login goes nowhere.** On success the page navigates to
  `/leads`, but that route does not exist. The user logs in but lands on a blank
  screen. This gets fixed when the leads feature is built.
- **Repeat wrong-password is silent.** The error message shows on the first failed
  attempt only; a second wrong attempt shows nothing.
- **No redirect when already logged in.** Visiting `/login` while logged in still
  shows the form.

## How to test

1. Seed the database so accounts exist: `pnpm --filter @lean-divida/api run seed`.
2. Start the app: `pnpm dev`, then open http://localhost:5173/login.
3. Log in with `admin@example.com` and the seed password.
