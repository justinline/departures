/* eslint-disable @typescript-eslint/no-var-requires */
import express from "express";
import bodyparser from "body-parser";
import { JSONFile } from "lowdb/node";
import { Low } from "lowdb";
import { config } from "dotenv";
import path from "path";
import getStations from "./getStations.js";

config();

const defaultData = { stations: ["Lower Donkington", "Zoomsbury"] };
const adapter = new JSONFile(".data/db.json");
const db = new Low(adapter, defaultData);

async function updateStations() {
  try {
    const lastThreeStations = db.data.stations.slice(-3);

    const stations = await getStations(lastThreeStations);

    db.data.stations = stations;

    console.log(stations);
  } catch (error) {
    console.error(`Error getting message: ${error}`);

    return;
  }
}

const fiveMinutes = 1000 * 60 * 5;

setInterval(updateStations, fiveMinutes);

updateStations().then(() => {
  updateStations();
});

const app = express();
app.use(bodyparser.json());
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.get("/api/motd", (req, res) => {
  console.log("GET /api/motd");
  const motd = db.data.stations;

  return res.send({ motd });
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
