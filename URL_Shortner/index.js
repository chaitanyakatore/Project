import express from "express";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.get("/", (req, res) => {
  return res.json({ status: "app is running " });
});

app.listen(8000, () => {
  console.log(`app is running on the port ${PORT}`);
});
