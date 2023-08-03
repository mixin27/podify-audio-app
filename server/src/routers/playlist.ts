import {
  createPlaylist,
  getAudios,
  getPlaylistByProfile,
  removePlaylist,
  updatePlaylist,
} from "#/controllers/playlist";
import { isVerified, mustAuth } from "#/middlewares/auth";
import { validate } from "#/middlewares/validator";
import {
  NewPlaylistValidationSchema,
  UpdatePlaylistValidationSchema,
} from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPlaylist
);

router.patch(
  "/",
  mustAuth,
  validate(UpdatePlaylistValidationSchema),
  updatePlaylist
);

router.delete("/", mustAuth, removePlaylist);

router.get("/by-profile", mustAuth, getPlaylistByProfile);
router.get("/:playlistId", mustAuth, getAudios);

export default router;
