import express from "express";

import userRouter from "./routes/user.route.js";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.use("/user", userRouter);

app.listen(8000, () => {
  console.log(`app is running on the port ${PORT}`);
});
