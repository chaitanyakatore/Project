import express from "express";
import { signupPostRequestBodySchema } from "../validation/request.validation.js";
import generatedHashedPassword from "../utils/encryption.js";
import {getUserByEmail, createUser} from "../services/user.service.js";

const userRouter = express.Router();

userRouter.post("/signup", async (req,res) => {
  const validationResult = await signupPostRequestBodySchema.safeParseAsync(
    req.body
  );

  if (validationResult.error) {
    return res
      .status(400)
      .json({ error: validationResult.error.format() });
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

export default userRouter;
