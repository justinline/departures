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
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 20,
    });

    const fourNewStations = completion.data.choices[0].text
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
