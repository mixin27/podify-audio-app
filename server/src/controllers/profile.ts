import { PaginationQuery } from "#/@types/misc";
import Audio, { AudioDocument } from "#/models/audio";
import Playlist from "#/models/playlist";
import User from "#/models/user";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";

// export const getUploads: RequestHandler = async (req, res) => {};
export const updateFollower: RequestHandler = async (req, res) => {
  let status: "added" | "removed";

  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id" });

  const profile = await User.findById(profileId);
  if (!profile) return res.status(404).json({ error: "No profile found" });

  const alreadyAFollower = await User.findOne({
    _id: profile._id,
    followers: req.user.id,
  });
  if (alreadyAFollower) {
    // Unfollow
    await User.updateOne(
      {
        _id: profile._id,
      },
      {
        $pull: { followers: req.user.id },
      }
    );
    status = "removed";
  } else {
    // follow the user
    await User.updateOne(
      {
        _id: profile._id,
      },
      {
        $addToSet: { followers: req.user.id },
      }
    );
    status = "added";
  }

  if (status === "added") {
    // update the following list (add)
    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { followings: profileId } }
    );
  }

  if (status === "removed") {
    // updat the following list (remove)
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { followings: profileId } }
    );
  }

  res.json({ status });
};

export const getUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as PaginationQuery;

  const data = await Audio.find({ owner: req.user.id })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: {
        name: req.user.name,
        id: req.user.id,
      },
    };
  });

  res.json({ audios });
};

export const getPublicUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as PaginationQuery;
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id" });

  const data = await Audio.find({ owner: profileId })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt")
    .populate<AudioDocument<{ name: string; _id: ObjectId }>>("owner");

  const audios = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      about: item.about,
      file: item.file.url,
      poster: item.poster?.url,
      date: item.createdAt,
      owner: {
        name: item.owner.name,
        id: item.owner._id,
      },
    };
  });

  res.json({ audios });
};

export const getPublicProfile: RequestHandler = async (req, res) => {
  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id" });

  const profile = await User.findById(profileId);
  if (!profile) return res.status(404).json({ error: "No profile found" });

  res.json({
    profile: {
      id: profile._id,
      name: profile.name,
      followers: profile.followers.length,
      followings: profile.followings.length,
      avatar: profile.avatar?.url,
    },
  });
};

export const getPublicPlaylist: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as PaginationQuery;

  const { profileId } = req.params;
  if (!isValidObjectId(profileId))
    return res.status(422).json({ error: "Invalid profile id" });

  const playlist = await Playlist.find({
    owner: profileId,
    visibility: "public",
  })
    .skip(parseInt(limit) * parseInt(pageNo))
    .limit(parseInt(limit))
    .sort("-createdAt");

  if (!playlist) return res.json({ playlist: [] });

  res.json({
    playlist: playlist.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    }),
  });
};
