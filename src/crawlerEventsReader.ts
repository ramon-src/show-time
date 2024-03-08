import { EventType } from "./types";

const fs = require("node:fs");
const defaultFilename = process.env.FILENAME;

export const eventsList = (filename = defaultFilename): EventType[] => {
  if (!filename) {
    throw new Error("Filename is required");
  }

  let events: EventType[];

  try {
    const data = fs.readFileSync(filename, "utf8");
    events = JSON.parse(data);
  } catch (err) {
    throw err;
  }

  if (!events) {
    throw new Error("Data is null or undefined");
  }

  return events;
};
