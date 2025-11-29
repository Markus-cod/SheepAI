import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import fs from "fs";

const REGION = "us-east-1"; // or whatever region your AWS Polly supports
const polly = new PollyClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

/**
 * Generate speech with Amazon Polly (Joey)
 */
export async function generatePollySpeech(text, outFile = "public/tts.mp3") {
  const params = {
    OutputFormat: "mp3",
    Text: text,
    VoiceId: "Joey",
    Engine: "neural"
  };

  const command = new SynthesizeSpeechCommand(params);
  const response = await polly.send(command);

  // Save audio to file
  const audioStream = response.AudioStream;
  if (audioStream) {
    const buffer = Buffer.from(await audioStream.transformToByteArray());
    fs.writeFileSync(outFile, buffer);
    console.log("✅ Generated:", outFile);
  }
}