/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import bodyparser from "body-parser";
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { config } from "dotenv";
import path from "path";
import getTrainList from "./getTrainList.js";

config();

const defaultData = {
  stations: ["Lower Donkington", "Muddy shore", "Clapton Forest", "East Chair"],
  lastUpdated: new Date().toISOString(),
};
const adapter = new JSONFile(".data/db.json");
const db = new Low(adapter, defaultData);

async function updateStations() {
  try {
    if (new Date().getHours() < 8) {
      return [];
    }
    if (db.data.stations.length <= 4) {
      const allNewstations = await getTrainList(db.data.stations.slice(1));
      db.data.stations = allNewstations;
    } else {
      // Drop the first station
      db.data.stations = db.data.stations.slice(1);
    }

    db.data.lastUpdated = new Date().toISOString();

    console.log(db.data.stations);
  } catch (error) {
    console.error(`Error updating stations: ${error}`);

    return;
  }
}

const fiveMinutes = 1000 * 60 * 5;

setInterval(updateStations, fiveMinutes);
updateStations();

const app = express();
app.use(bodyparser.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.get("/api/motd", (req, res) => {
  console.log("GET /api/motd");

  const firstFourStations = db.data.stations.slice(0, 4);

  return res.send({
    motd: firstFourStations,
    lastUpdated: db.data.lastUpdated,
  });
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
