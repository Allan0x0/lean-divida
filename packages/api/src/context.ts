import type { IncomingMessage, ServerResponse } from "node:http";
import { decodeAndVerifyJwtToken } from "./auth";

/** The authenticated user, once auth is wired. Absent until then. */
export type AuthedUser = { id: number; userType: "ADMIN" | "OFFICER" };

// req/res are typed as Node's http types, not express, so this shared type
// stays portable across packages. Express's Request/Response extend these, so
// reading headers/cookies for auth works unchanged.
export type Context = {
  req: IncomingMessage;
  res: ServerResponse;
  user?: AuthedUser;
};

// No auth yet. Every request gets an anonymous context; add token/cookie
// verification here and set `user` when you build login.
export async function createContext({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
  async function getUserFromHeader() {
    const header = req.headers.authorization;
    if (!header || !header?.startsWith("Bearer ")) {
      return undefined;
    }
    try {
      const token = header.split(" ")[1];
      if (!token) {
        throw new Error("Token not present");
      }
      const user = await decodeAndVerifyJwtToken(token);
      return user;
    } catch (err) {
      console.warn(err);
      return undefined;
    }
  }
  const user = await getUserFromHeader();
  return { req, res, user };
}
