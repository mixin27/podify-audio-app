import { RequestWithFiles } from "#/middlewares/fileParser";
import { categoriesTypes } from "#/utils/audio_category";
import { RequestHandler } from "express";
import formidable from "formidable";
import cloudinary from "#/cloud";
import Audio from "#/models/audio";

interface CreateAudioRequest extends RequestWithFiles {
  body: {
    title: string;
    about: string;
    category: categoriesTypes;
  };
}

export const createAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;

  const poster = req.files?.poster as formidable.File[];
  const audioFile = req.files?.file as formidable.File[];
  const ownerId = req.user.id;

  if (audioFile.length < 1)
    return res.status(422).json({ error: "Audio file is required." });

  try {
    const audioRes = await cloudinary.uploader.upload(audioFile[0].filepath, {
      resource_type: "video",
    });

    const createdAudio = new Audio({
      title: title[0],
      about: about[0],
      category: category[0],
      owner: ownerId,
      file: {
        url: audioRes.url,
        publicId: audioRes.public_id,
      },
    });

    if (poster) {
      const posterRes = await cloudinary.uploader.upload(poster[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      createdAudio.poster = {
        url: posterRes.secure_url,
        publicId: posterRes.public_id,
      };
    }

    await createdAudio.save();

    res.status(201).json({
      audio: {
        title,
        about,
        file: createdAudio.file.url,
        poster: createdAudio.poster?.url,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateAudio: RequestHandler = async (
  req: CreateAudioRequest,
  res
) => {
  const { title, about, category } = req.body;

  const poster = req.files?.poster as formidable.File[];
  const ownerId = req.user.id;
  const { audioId } = req.params;

  const audio = await Audio.findOneAndUpdate(
    { owner: ownerId, _id: audioId },
    { title: title[0], about: about[0], category: category[0] },
    { new: true }
  );

  if (!audio) return res.status(404).json({ error: "Record not found" });

  try {
    if (poster) {
      if (audio.poster?.publicId) {
        await cloudinary.uploader.destroy(audio.poster.publicId);
      }

      const posterRes = await cloudinary.uploader.upload(poster[0].filepath, {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      });

      audio.poster = {
        url: posterRes.secure_url,
        publicId: posterRes.public_id,
      };
      await audio.save();
    }

    res.json({
      audio: {
        title,
        about,
        file: audio.file.url,
        poster: audio.poster?.url,
      },
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
