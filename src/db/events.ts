import client from "./server";

export async function insertEvents(events) {
  try {
    await client.connect();
    await client.db("show-time").collection("events").insertMany(events)
  } finally {
    await client.close();
  }
}
