export type ArtistSearch = {
  artist: string;
  location: string;
  type: string;
  moments: string[];
};

export type EventType = {
  artist: string;
  title: string;
  location: string;
  time: string;
  day: string;
  month: string;
  region: string;
  img_url?: string;
};
