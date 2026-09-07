import z from "zod";

export const EmailSchema = z.email().min(4).max(20).transform((str) => str.toLowerCase().trim());

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string(),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(4, "Use at least 4 characters for your name"),
  userType: z.enum(["ADMIN", "OFFICER"]),
  email: EmailSchema,
  password: z.string().min(6, "Use at least 6 characters for the password"),
  reEnterPassword: z.string(),
}).refine((arg => arg.password === arg.reEnterPassword), {
  message: "Passwords don't match",
  path: ["password"],
});
export type RegisterInput = z.infer<typeof RegisterSchema>;