import { verifyToken } from "../utils/token.js";

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.user = decoded;
  next();
}

function ensureAuthenticated(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(404).json({ error: `User with ${email} does not exist` });
  }
  next();
}

export { authenticationMiddleware };
