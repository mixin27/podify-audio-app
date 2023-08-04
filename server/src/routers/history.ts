import {
  getHistories,
  getRecentlyPlayed,
  removeHistory,
  updateHistory,
} from "#/controllers/history";
import { mustAuth } from "#/middlewares/auth";
import { validate } from "#/middlewares/validator";
import { UpdateHistoryValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  mustAuth,
  validate(UpdateHistoryValidationSchema),
  updateHistory
);

router.delete("/", mustAuth, removeHistory);
router.get("/", mustAuth, getHistories);
router.get("/recently-played", mustAuth, getRecentlyPlayed);

export default router;
