import { Request } from "express";

export interface UpdateHistoryRequest extends Request {
  body: {
    audio: string;
    progress: number;
    date: string;
  };
}
