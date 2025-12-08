import express from "express";
import {
  signinRequestBodySchema,
  signupPostRequestBodySchema,
} from "../validation/request.validation.js";
import generatedHashedPassword from "../utils/encryption.js";
import { getUserByEmail, createUser } from "../services/user.service.js";
import { generateToken } from "../utils/token.js";

const userRouter = express.Router();

//signup route to regrister the user
userRouter.post("/signup", async (req, res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser)
    return res.status(400).json({ error: `user with ${email} already exists` });

  const { salt, password: hashedPassword } = generatedHashedPassword(password);

  const user = await createUser({
    firstname,
    lastname,
    email,
    salt,
    password: hashedPassword,
  });

  return res.status(201).json({ data: { userId: user.id } });
});

// login route for the token generation
userRouter.post("/login", async (req, res) => {
  const validationResult = await signinRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const user = await getUserByEmail(email);

  if (!user) {
    return res
      .status(404)
      .json({ error: `User with ${email} does not exist` });
  }

  // Re-hash the password using the same salt from the DB
  const { password: hashedPassword } = generatedHashedPassword(
    password,
    user.salt
  );

  if (user.password !== hashedPassword) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = generateToken({ id: user.id });

  return res.json({ token });
});


export default userRouter;
