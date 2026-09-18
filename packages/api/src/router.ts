import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { issueToken } from "./auth";
import { prisma } from "./db";
import { LoginSchema, RegisterSchema } from "./schema";
import { publicProcedure, router } from "./trpc";

function getSafePublicUserFields(user: { passwordHash: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safeFields } = user;
  return safeFields;
}

export const appRouter = router({
  health: router({
    ping: publicProcedure.query(() => ({ ok: true as const, time: new Date() })),
  }),
  auth: {
    currentUser: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.user) {
        return undefined;
      }
      const currentUser = await prisma.user.findUnique({
        where: { id: ctx.user.id },
        select: { id: true, name: true, email: true, userType: true },
      });
      return currentUser || undefined;
    }),
    register: publicProcedure.input(RegisterSchema).mutation(async ({ input }) => {
      try {
        const numDuplicates = await prisma.user.count({
          where: { email: input.email },
        });
        if (numDuplicates) {
          throw new TRPCError({ code: "CONFLICT", message: "Email already used" });
        }
        
        const newUser = await prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
            userType: input.userType,
            passwordHash: await bcrypt.hash(input.password, 10),
          }
        });
        
        const token = await issueToken(newUser);
        return {
          token,
          user: getSafePublicUserFields(newUser)
        };
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }
        console.error("Registration failed", err);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
      }
    }),
    login: publicProcedure
      .input(LoginSchema)
      .mutation(async ({ input }) => {
        try {
          const user = await prisma.user.findFirst({
            where: { email: input.email },
          });
          if (!user) {
            throw new TRPCError({ code: "UNAUTHORIZED", cause: "Invalid credentials" });
          }

          const isValid = await bcrypt.compare(input.password, user.passwordHash);
          if (!isValid) {
            throw new TRPCError({ code: "UNAUTHORIZED", cause: "Invalid credentials" });
          }

          const { id, userType } = user;
          const token = await issueToken({ id, userType });

          return {
            token,
            user: getSafePublicUserFields(user)
          }
        } catch (err) {
          if (err instanceof TRPCError) {
            throw err;
          }
          console.error("Login failed", err);
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", cause: err });
        }
      }),
  }
});

export type AppRouter = typeof appRouter;
