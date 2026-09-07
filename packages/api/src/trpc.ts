import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";
import { Env } from "./env";
import { ZodError } from "zod";

const USER_FACING = new Set(["UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "CONFLICT", "TOO_MANY_REQUESTS"]);

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    const zodError = error.cause instanceof ZodError ? error.cause.flatten() : null;
    const safe = zodError !== null || USER_FACING.has(error.code);
    return {
      ...shape,
      message: Env.NODE_ENV === "production" && !safe ? "Something went wrong" : shape.message,
      data: { ...shape.data, zodError }
    }
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const updatedCtx = {
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    }
  }
  return opts.next(updatedCtx);
});
