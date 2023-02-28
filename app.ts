import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, OpenAIApi } from "openai";
import express, { Response, Application, Request } from "express";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const app: Application = express();
// const options: cors.CorsOptions = {

//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "X-Access-Token",
//   ],
//   credentials: true,
//   methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
//   origin: "http://localhost:5000",
//   preflightContinue: false,
// };

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());

app.post("/api/chatGpt", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 1024,
    temperature:0
  });
  res.status(200).send(completion.data.choices[0].text);
});

const port = 5000;
const host = "http://localhost";

app.listen(port, () => {
  console.log(`\nServer listening on ${host}:${port}\n`);
});
 
