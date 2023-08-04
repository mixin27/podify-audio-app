import { PaginationQuery } from "#/@types/misc";
import History, { HistoryType } from "#/models/history";
import { RequestHandler } from "express";

export const updateHistory: RequestHandler = async (req, res) => {
  const { audio, progress, date } = req.body;
  const oldHistory = await History.findOne({ owner: req.user.id });

  const history: HistoryType = { audio, progress, date };

  if (!oldHistory) {
    await History.create({
      owner: req.user.id,
      last: history,
      all: [history],
    });
    return res.json({ success: true });
  }

  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );

  const histories = await History.aggregate([
    {
      $match: { owner: req.user.id },
    },
    { $unwind: "$all" },
    {
      $match: {
        "all.date": {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
    },
    {
      $project: {
        _id: 0,
        audioId: "$all.audio",
      },
    },
  ]);

  const sameDayHistory = histories.find(
    ({ audioId }) => audioId.toString() === audio
  );

  if (sameDayHistory) {
    await History.findOneAndUpdate(
      {
        owner: req.user.id,
        "all.audio": audio,
      },
      {
        $set: {
          "last.progress": progress,
          "last.date": date,
          "all.$.progress": progress,
          "all.$.date": date,
        },
      }
    );
  } else {
    await History.findByIdAndUpdate(oldHistory._id, {
      $push: { all: { $each: [history], $position: 0 } },
      $set: { last: history },
    });
  }

  res.json({ success: true });
};

export const removeHistory: RequestHandler = async (req, res) => {
  const removeAll = req.query.all === "yes";
  if (removeAll) {
    await History.findOneAndDelete({ owner: req.user.id });
    return res.json({ success: true });
  }

  const histories = req.query.histories as string;
  const ids = JSON.parse(histories) as string[];

  await History.findOneAndUpdate(
    { owner: req.user.id },
    {
      $pull: { all: { _id: ids } },
    }
  );

  res.json({ success: true });
};

export const getHistories: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query as PaginationQuery;

  const histories = await History.aggregate([
    { $match: { owner: req.user.id } },
    {
      $project: {
        all: {
          $slice: ["$all", parseInt(limit) * parseInt(pageNo), parseInt(limit)],
        },
      },
    },
    { $unwind: "$all" },
    {
      $lookup: {
        from: "audios",
        localField: "all.audio",
        foreignField: "_id",
        as: "audioInfo",
      },
    },
    { $unwind: "$audioInfo" },
    {
      $project: {
        _id: 0,
        id: "$all._id",
        audioId: "$audioInfo._id",
        date: "$all.date",
        title: "$audioInfo.title",
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        audios: { $push: "$$ROOT" },
      },
    },
    { $project: { _id: 0, id: "$id", date: "$_id", audios: "$$ROOT.audios" } },
    { $sort: { date: -1 } },
  ]);

  res.json({ histories });
};

export const getRecentlyPlayed: RequestHandler = async (req, res) => {
  const match = { $match: { owner: req.user.id } };
  const sliceMatch = { $project: { myHistory: { $slice: ["$all", 10] } } };
  const dateSort = {
    $project: {
      histories: {
        $sortArray: { input: "$myHistory", sortBy: { date: -1 } },
      },
    },
  };
  const unwindWithIndex = {
    $unwind: { path: "$histories", includeArrayIndex: "index" },
  };
  const audioLookup = {
    $lookup: {
      from: "audios",
      localField: "histories.audio",
      foreignField: "_id",
      as: "audioInfo",
    },
  };
  const unwindAudioInfo = { $unwind: "$audioInfo" };
  const ownerLookup = {
    $lookup: {
      from: "users",
      localField: "audioInfo.owner",
      foreignField: "_id",
      as: "owner",
    },
  };
  const unwindOwner = { $unwind: "$owner" };
  const projectResult = {
    $project: {
      _id: 0,
      id: "$audioInfo._id",
      title: "$audioInfo.title",
      about: "$audioInfo.about",
      file: "$audioInfo.file.url",
      poster: "$audioInfo.poster.url",
      category: "$audioInfo.category",
      owner: {
        name: "$owner.name",
        id: "$owner._id",
      },
      date: "$histories.date",
      progress: "$histories.progress",
      index: "$index",
    },
  };

  const audios = await History.aggregate([
    match,
    sliceMatch,
    dateSort,
    unwindWithIndex,
    audioLookup,
    unwindAudioInfo,
    ownerLookup,
    unwindOwner,
    projectResult,
  ]);

  res.json({ audios });
};
