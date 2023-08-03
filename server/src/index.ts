import express from "express";
import "dotenv/config";
import "#/db";
import { PORT } from "#/utils/variables";
import authRouter from "#/routers/auth";
import audioRouter from "#/routers/audio";

const app = express();

// register middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);

app.listen(PORT, () => {
  console.log(`🚀 Podify server is listening on port ${PORT}`);
});
