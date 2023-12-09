import express, { response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const KEY = process.env.KEY

const configuration = new Configuration({
  apiKey: KEY ,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "testing server2",
  });
});


app.post("/", async (req, res) => {
  try {
  
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": "testing"}],
      temperature: 1,
      max_tokens: 2048,
      presence_penalty: 1,
      frequency_penalty: 1,
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content
    });

    console.log(response.data.choices[0].message.content)
  } catch (error) {
    console.log(error);
    res.status(500).send(error || "Er is iets fout gegaan");
  }
});

app.listen(5000, () =>
  console.log("server is running at http://localhost:5000")
);
