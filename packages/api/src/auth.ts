import { jwtVerify, SignJWT } from "jose";
import { Env } from "./env";

const secret = new TextEncoder().encode(Env.JWT_SECRET);

export type AuthedUser = {
  id: number;
  userType: "ADMIN" | "OFFICER";
}

export async function decodeAndVerifyJwtToken (token: string) {
  const { payload } = await jwtVerify(token, secret); // this should throw if token expired or fucked with
  return {
    id: Number(payload.sub),
    userType: payload.userType as AuthedUser["userType"]
  }
}

export async function issueToken (user: AuthedUser, exp = "30d") {
  return new SignJWT({ userType: user.userType })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setExpirationTime(exp)
    .sign(secret);
}