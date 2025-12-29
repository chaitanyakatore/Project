import { Router } from "express";
import { getHabits, logHabit, getProgress } from "../controllers/habitController";

const router = Router();

router.get("/habits", getHabits);
router.post("/logs", logHabit);
router.get("/progress", getProgress);

export default router;
