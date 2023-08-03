import {
  CreatePlaylistRequest,
  PopulateFavoriteList,
  UpdatePlaylistRequest,
} from "#/@types/audio";
import Audio from "#/models/audio";
import Playlist from "#/models/playlist";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const createPlaylist: RequestHandler = async (
  req: CreatePlaylistRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id;

  if (resId) {
    // If resource id is provided
    const audio = await Audio.findById(resId);
    if (!audio)
      return res.status(404).json({ error: "Could not find the audio." });
  }

  const createdPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  });

  // already validate to make sure mongoose ObjectId
  if (resId) createdPlaylist.items = [resId as any];
  await createdPlaylist.save();

  res.status(201).json({
    playlist: {
      id: createdPlaylist._id,
      title: createdPlaylist.title,
      visibility: createdPlaylist.visibility,
    },
  });
};

export const updatePlaylist: RequestHandler = async (
  req: UpdatePlaylistRequest,
  res
) => {
  const { title, id, item, visibility } = req.body;
  const ownerId = req.user.id;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: ownerId },
    { title, visibility },
    { new: true }
  );

  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  if (item) {
    const audio = await Audio.findById(item);
    if (!audio) return res.status(404).json({ error: "Audio not found" });

    await Playlist.findByIdAndUpdate(playlist._id, {
      $addToSet: { items: item },
    });
  }

  res.json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (req, res) => {
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid playlist Id" });

  if (all === "yes") {
    const playlist = await Playlist.findByIdAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid audio Id" });

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, owner: req.user.id },
      {
        $pull: {
          items: resId,
        },
      }
    );
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  res.json({ success: true });
};

export const getPlaylistByProfile: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as {
    pageNo: string;
    limit: string;
  };

  const data = await Playlist.find({
    owner: req.user.id,
    visibility: {
      $ne: "auto",
    },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itemsCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.json({ playlist });
};

export const getAudios: RequestHandler = async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid playlist Id" });

  const playlist = await Playlist.findOne({
    owner: req.user.id,
    _id: playlistId,
  }).populate<{ items: PopulateFavoriteList[] }>({
    path: "items",
    populate: {
      path: "owner",
      select: "name",
    },
  });
  if (!playlist) return res.json({ list: [] });
  const audios = playlist.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: {
        name: item.owner.name,
        id: item.owner._id,
      },
    };
  });

  res.json({
    list: {
      id: playlist._id,
      title: playlist.title,
      audios,
    },
  });
};
