# Vanilla login: what to write, and where it came from

Scaffold: `apps/web/public/login-vanilla.html`.

Run it by opening the file: `open apps/web/public/login-vanilla.html`. There are
no local imports, and both CDNs allow a page at origin `null`, so `file://` is
enough. Two things to know: Safari blocks `localStorage` on `file://`, so the
session will not survive a reload there, and if the console ever shows a CORS
error, serve the folder instead:

    python3 -m http.server 8000 --directory apps/web/public
    # http://localhost:8000/login-vanilla.html

It also sits in `public/`, so `pnpm dev` serves it at
`/login-vanilla.html` on whichever port Vite prints.

The markup, the imports and the constants are done. Eight function bodies are
empty. Below is what each one has to do, in order. No code, so you write it.

## Where each stub comes from

| Stub | Replaces | In the React app |
|---|---|---|
| `getSession` / `setSession` | token storage | `apps/web/src/token.ts` |
| `getErrorMessage` | error copy lookup | `apps/web/src/lib/errors.ts` |
| `fakeLogin` | the server call | `packages/api/src/router.ts`, `auth.login` |
| `handleSubmit` | form submit handler | `apps/web/src/routes/Login.tsx` |
| `render` | deciding which view shows | react-query's `useAuth` + `ProtectedRoute` |
| `handleLogout` | clearing the session | `apps/web/src/auth.ts`, `useLogout` |
| `wait` | nothing; it fakes network delay | — |

## The algorithms

### `wait(ms)`

1. Return a promise that resolves after `ms` milliseconds.

### `getSession()`

Returns the stored session object, or `undefined` when there is none.

1. Read `STORAGE_KEY` from `localStorage`.
2. Nothing there? Return `undefined`.
3. Parse the string as JSON and return the result.
4. Wrap the whole thing so a throw returns `undefined` instead. Storage can be
   unavailable (private mode, blocked cookies) and the stored string can be
   junk from an earlier experiment. `token.ts` does the same with try/catch.

### `setSession(session)`

Writes the session, or clears it when called with nothing.

1. Got a session? Serialise it to JSON and write it under `STORAGE_KEY`.
2. No session? Remove `STORAGE_KEY`.
3. Wrap in try/catch; on failure log to the console and carry on. The page
   still works for this visit, it just will not survive a reload.

The stored shape is your choice, but `render` needs an email and a token, so:
`{ token, email }` at minimum. Storing the whole user object is fine too.

### `getErrorMessage(err)`

1. Read the `code` off the error (`fakeLogin` throws objects carrying one).
2. Look that code up in `COPY_MAP` and return the hit.
3. No code, or a code not in the map? Return
   `"Something went wrong, please try again"`.

### `fakeLogin(input)` — async

Stands in for `auth.login` on the server. `input` is already validated.

1. Await `wait(600)` so the pending state is visible.
2. Find the entry in `USERS` whose `email` matches `input.email`.
3. No match? Throw an object with `code: "UNAUTHORIZED"`.
4. `input.password` is not `PASSWORD`? Throw the same thing. Same error for a
   bad email and a bad password, deliberately: telling the two apart tells an
   attacker which emails have accounts.
5. Return `{ token, user }`, where `token` is any made-up string (include the
   email or a timestamp so you can tell two logins apart).

### `render()`

The whole of "which screen am I on", with no framework.

1. Call `getSession()`.
2. Set `loginView.hidden` to true when there is a session, false when not.
3. Set `sessionView.hidden` to the opposite.
4. There is a session? Put its email in `whoEl.textContent` and its token in
   `tokenEl.textContent`.

Use `textContent`, never `innerHTML`. `textContent` cannot execute anything it
is handed; `innerHTML` can, and this string came from outside your code.

### `handleSubmit(event)` — async

1. `event.preventDefault()`, or the browser does its own form POST and reloads
   the page out from under you.
2. Read `emailInput.value` and `passwordInput.value` into one object.
3. Run `LoginSchema.safeParse` on it. `safeParse` never throws; it returns
   `{ success: true, data }` or `{ success: false, error }`.
4. Failed? `alert` a `"> "` prefix plus the first issue's message, falling back
   to `"Check your input."`, then return. (Same copy as `Login.tsx`.)
5. Passed? Use `result.data`, not what you read in step 2. The schema lowercases
   and trims the email, and only `data` has that applied.
6. Disable `submitBtn` and set its text to `"Logging In..."`.
7. In a `try`: await `fakeLogin(data)`, then `setSession` with the token and the
   returned user's email, then `render()`.
8. In the `catch`: `alert(getErrorMessage(err))`. This runs on every failed
   attempt, including the second one in a row. The React page alerts only on the
   first, because its `useEffect` watches `[login.isError]` and that flag is
   already `true` the second time, so the effect never re-fires.
9. In a `finally`: re-enable the button and set its text back to `"Log In"`.
   `finally` is what react-query's `isPending` was doing for you.

### `handleLogout()`

1. `setSession(undefined)`.
2. Clear `passwordInput.value` so the next person at the machine does not find
   it sitting in the field.
3. `render()`.

## What the browser did for free

- **`hidden` instead of conditional JSX.** One attribute on an element that is
  always in the document. No re-render, no reconciliation, no keys.
- **`textContent` instead of state.** There is no copy of the UI to keep in
  sync, so there is nothing to diff. The DOM is the state.
- **`try`/`finally` instead of `isPending`.** The button re-enables because the
  function finished, not because a library flipped a flag you then read.
- **The form element itself.** `required`, `type="email"` and Enter-to-submit
  are browser behaviour. `TextField` and `Button` were styling, not function.

## Things this file deliberately does not do

No network call, no router, no per-field errors, no register form. Those are
separate rows in `PROGRESS.md`.
