import express from "express";

import userRouter from "./routes/user.route.js";
import urlRouter from "./routes/url.route.js";
import { authenticationMiddleware } from "./middleware/auth.middleware.js";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use("/user", userRouter);

app.use(authenticationMiddleware);
app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`app is running on the port ${PORT}`);
});

export default app;
