import express, { application, response } from "express";
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
    message: "testing server",
  });
});



app.post("/", async (req, res) => {
  try {
  

      let character = req.body.character
      let thema = req.body.thema
      let geletterdheid = req.body.geletterdheid


    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": `Schrijf een kort verhaal wat leuk is voor kinderen kinderen. Het hoofdcharacter heeft een aantal eigenschappen: ${character[0]},${character[1]}. het character is een${character[2]}. Het thema is ${thema[0]}, ${thema[1]},${thema[2]} en het lees niveau is ${geletterdheid[0]}, dus zorg dat de tekst past bij het leesniveau. Creer alinias zodat het makkelijk te lezen is` }],
      temperature: 1,
      presence_penalty: 1,
      frequency_penalty: 1,
    });

    const antwoord = response.data.choices[0].message.content

    const options ={
        method: "POST",
        header: {
          "authorization": `Bearer ${KEY}`,
          'content-type': "application/json"
        },
        body: JSON.stringify({
          "prompt": `Maak een strip cover`,
          "n": "1",
          "size": "1024x1024"
        })
    }

    const image = await fetch('https://api.openai.com/v1/images/generations', options)
    const imgdata = await image.json()
  

    res.status(200).send({
      bot: response.data.choices[0].message.content,
      imagedata: imgdata

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
