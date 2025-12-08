import express from "express";
import { shortenPostBodySchema } from "../validation/request.validation.js";

import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import { nanoid } from "nanoid";

const urlRouter = express.Router();

urlRouter.post("/shorten", async function (req, res) {
  const userId = req.user?.id;

  if (!userId) {
    return res
      .status(401)
      .json({ error: "you must logged in to access the resource" });
  }

  const validationResult = await shortenPostBodySchema.safeParseAsync(req.body);

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);

  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetUrl: url,
      userId: req.user.id,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetUrl: result.targetUrl,
  });
});

export default urlRouter;
