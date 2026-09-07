import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@lean-divida/api";

// Explicit annotation: without it tsc can't name the inferred type portably.
export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
