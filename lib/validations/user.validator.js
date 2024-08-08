const { z } = require("zod");

const UserSignUpValidationSchema = z.object({
  firstName: z.string().min(2).max(25),
  lastName: z.string().min(2).max(25).optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d.*\d.*\d/, "Password must contain at least three numbers")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const UserSigninValidationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

module.exports = {
  UserSignUpValidationSchema,
  UserSigninValidationSchema,
};
