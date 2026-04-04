const OktaJwtVerifier = require("@okta/jwt-verifier");

// 1. Configure the Verifier
// It needs to know WHICH Okta server issued the token, and WHICH app it was meant for.
const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: process.env.OKTA_ISSUER, // e.g., https://dev-123456.okta.com/oauth2/default
  clientId: process.env.OKTA_CLIENT_ID, // e.g., 0oab1c2d3e4f5g6h7
});

// 2. The Middleware Function
// Middleware ALWAYS takes three arguments: req (incoming data), res (outgoing response), and next (move to the next step)
const verifyToken = async (req, res, next) => {
  try {
    // 3. Extract the token from the "Authorization" header
    // The header usually looks like: "Bearer eyJhbGciOiJIUz..."
    const authHeader = req.headers.authorization || "";
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
      // If there is no token, reject them immediately with a 401 Unauthorized
      return res
        .status(401)
        .json({ error: "Access Denied: No token provided." });
    }

    const accessToken = match[1];

    // 4. Verify the token with Okta's servers
    // This checks if the token is expired, tampered with, or invalid
    const jwt = await oktaJwtVerifier.verifyAccessToken(
      accessToken,
      "api://default",
    );

    // 5. Success! Attach the user's Okta ID to the request so our other routes know WHO is making the request
    req.userId = jwt.claims.sub; // 'sub' is the subject (the user's unique ID)

    // 6. Pass control to the next function (the actual route handler)
    next();
  } catch (err) {
    // If verification fails (e.g., token expired), catch the error and reject the request
    console.error("JWT Verification Failed:", err.message);
    res.status(401).json({ error: "Access Denied: Invalid or expired token." });
  }
};

module.exports = verifyToken;
