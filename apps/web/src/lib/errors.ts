import type { AppRouter } from "@lean-divida/api";
import { TRPCClientError } from "@trpc/client";
import z from "zod";

export function isTRPCError(error: unknown): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}

export function getErrorCode(error: unknown) {
  return isTRPCError(error) ? error.data?.code : undefined;
}

export const COPY_MAP: Record<string, string> = {
  UNAUTHORIZED: "Wrong email or password.",
  FORBIDDEN: "You don't have access to that.",
  CONFLICT: "That already exists.",
  NOT_FOUND: "Not found.",
  TOO_MANY_REQUESTS: "Too many attempts. Wait a moment.",
}

export function getErrorMessage (error: unknown) {
  const code = getErrorCode(error);
  if (code) {
    return COPY_MAP[code];
  }
  return "Something went wrong, please try again";
}

const FlattenedZodErrors = z.object({
  formErrors: z.string().array(),
  fieldErrors: z.record(z.string(), z.string().array().optional()),
});

export function getFieldErrors (error: unknown): Record<string, string[]> {
  if (!isTRPCError(error)) {
    return {}
  }
  const parseResult = FlattenedZodErrors.safeParse(error.data?.zodError);
  if (!parseResult.success) {
    return {}
  }
  const arr = Object.entries(parseResult.data.fieldErrors);
  const relevantEls = arr.filter(([, errors]) => errors?.length);
  return Object.fromEntries(relevantEls) as Record<string, string[]>;
}