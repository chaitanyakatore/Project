import { createHmac, randomBytes } from "crypto";

export default function generatedHashedPassword(
  password,
  userSalt = undefined
) {
  const salt = userSalt ?? randomBytes(256).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return { salt, password: hash };
}
