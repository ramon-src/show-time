import { EventType } from "../types";

export const urlify = (text: string) => {
  return encodeURIComponent(text).toLowerCase().replace(/%20/gi, "+");
};

export const concatEventData = (event: EventType, moment: string) => {
  return urlify(`${event.type} ${event.artist} ${moment} ${event.location}`);
};
