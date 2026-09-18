import * as z from "zod";

const Register = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .refine((val) => /[0-9]/.test(val), { error: "Must include a number" })
    .refine((val) => /[^A-Za-z0-9]/.test(val), { error: "Must include a symbol" })
    .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
    .refine((val) => /[a-z]/.test(val), { error: "Must include a lowercase letter" }),
})

const Login = z.object({
  username: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),

})

const ResetPassword = z.object({
  username: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .refine((val) => /[0-9]/.test(val), { error: "Must include a number" })
    .refine((val) => /[^A-Za-z0-9]/.test(val), { error: "Must include a symbol" })
    .refine((val) => /[A-Z]/.test(val), { error: "Must include an uppercase letter" })
    .refine((val) => /[a-z]/.test(val), { error: "Must include a lowercase letter" })
})

const Tasks = z.object({
  title: z.string().trim().min(1, "Title is required").max(20, "Title must be at most 100 characters").regex(/^[a-zA-Z0-9 .,!?'\-\r\n]+$/),
  description: z.string().trim().min(1, "Description is required").regex(/^[a-zA-Z0-9 .,!?'\-\r\n]+$/),
  deadline: z.coerce.date(),
})

export { Register, Login, ResetPassword, Tasks };