import { config } from "dotenv";
import { Configuration, OpenAIApi } from "openai";
import buildGptPrompt from "./buildGptPrompt.js";

config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const getTrainList = async (previousStations = []) => {
  const prompt = buildGptPrompt(previousStations);

  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const fourNewStations = chatCompletion.data.choices[0].message.content
      .split(",")
      .filter((s) => s !== "");

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

export default getTrainList;
