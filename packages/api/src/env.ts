import z from "zod";

const EnvSchema = z.object({
  JWT_SECRET: z.string().min(6),
  NODE_ENV: z.enum(["production", "development"]).default("development"),
});

const result = EnvSchema.safeParse(process.env);
if (!result.success) {
  console.error(result.error.message);
  process.exit();
}
export const Env = result.data;