import Audio from "#/models/audio";
import AutoGeneratedPlaylist from "#/models/autoGeneratedPlaylist";
import cron from "node-cron";

// The five fields in the cron syntax represent (in order)
// minutes, hours, day of the month, month, and day of the week.
// cron.schedule("*/2 * * * * *", () => {
//   console.log("I am running...");
// });

const generatePlaylist = async () => {
  const result = await Audio.aggregate([
    { $sort: { likes: -1 } },
    { $sample: { size: 20 } },
    { $group: { _id: "$category", audios: { $push: "$$ROOT._id" } } },
  ]);

  result.map(async (item) => {
    await AutoGeneratedPlaylist.updateOne(
      {
        title: item._id,
      },
      { $addToSet: { items: item.audios } },
      { upsert: true }
    );
  });
};

// */2 * * * * *
cron.schedule("0 0 * * *", async () => {
  // this will run on every 24 hrs
  await generatePlaylist();
});
