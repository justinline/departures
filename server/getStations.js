import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import getStationName from "./getStationName.js";

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const getMessageOfTheDay = async (previousStations = []) => {
  // return previousStations;

  const prompt = getStationName(previousStations);
  console.log("Latest prompt is: " + prompt);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 12,
    });

    const fourNewStations = completion.data.choices[0].text
      .split(",")
      .filter((s) => s !== "");
    console.log("New stations: " + JSON.stringify(fourNewStations.join(", ")));

    return [
      ...previousStations,
      // regex Replace trailing . with ''
      ...fourNewStations.map((s) => s.replace(/\.$/, "").trim()),
    ];
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    return previousStations;
  }
};

export default getMessageOfTheDay;
