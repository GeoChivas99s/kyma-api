import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import express, { Response, Application, Request } from "express";
import fs from "fs";
import speech from "@google-cloud/speech";

const keyFilename = "./keys/keyfile.json";
const projectId = "august-boulder-379908";

const client = new speech.SpeechClient({ keyFilename, projectId });

const configuration = new Configuration({
  apiKey: "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",
});
process.env.GOOGLE_APPLICATION_CREDENTIALS = "keyfile.json";

const openai = new OpenAIApi(configuration);

const app: Application = express();
const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "http://192.168.0.104:5000",
  preflightContinue: false,
};

app.use(cors(options));
app.options("*", cors());
app.use(bodyParser.json());

app.post("/api/chatGpt", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1024,
    temperature: 0,
  });
  res.status(200).send(completion.data.choices[0].text);
});
app.get("/api/numeros", (req: Request, res: Response) => {
  res.status(200).send("Geovane é Lindo!!!");
});

app.post("/api/diagnostic", async (req: Request, res: Response) => {
  const { uri } = req.body;
  // const  file = fs.readFileSync("teste.mp3").toString(base64)
  // const audio = {
  //   content: file,
  // };
  const file = "teste.wav";

  const request = {
    config: {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "pt-PT",
    },
    audio: {
      content: fs.readFileSync(file).toString("base64"),
    },
    // speechContexts: [
    //   {
    //     phrases: [
    //       'bloqueio',
    //       'repetição',
    //       'prolongamento',
    //     ],
    //   },
    // ],
  };

  // const request = {
  //   audio: audio,
  //   config: config,
  // };

  const [response] = await client.recognize(request as any);
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");

  res.status(200).send({
    res: transcription,
  });
});
const port = 5000;
const host = "http://localhost";

app.listen(port, () => {
  console.log(`\nServer listening on  192.168.0.104:${port}\n`);
});
