// ==============================================
// DOOM SCROLLER SERVER WITH AMAZON POLLY (Joey)
// ==============================================

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

// ---- AWS Polly Setup ----
const REGION = "us-east-1"; // change if needed

const polly = new PollyClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// ---- Express + Socket.IO Setup ----
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

let latestText = "";

// ---- Helper: Generate Joey Voice ----
async function generatePollySpeech(text, outFile = "public/tts.mp3") {
  try {
    console.log("🌀 Generating Joey voice for:", text.substring(0, 60) + "...");
    const params = {
      OutputFormat: "mp3",
      Text: text,
      VoiceId: "Joey", // 👈 narrator
      Engine: "neural"
    };

    const command = new SynthesizeSpeechCommand(params);
    const response = await polly.send(command);
    const audioStream = response.AudioStream;
    if (audioStream) {
      const buffer = Buffer.from(await audioStream.transformToByteArray());
      fs.writeFileSync(outFile, buffer);
      console.log("✅ Joey narration saved:", outFile);
    }
  } catch (err) {
    console.error("❌ Polly error:", err);
  }
}

// ---- POST: receive new text ----
app.post("/api/text", async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ message: "Invalid text input." });
  }

  latestText = text;
  io.emit("new_text", text);
  console.log("📜 Received text:", text.substring(0, 80));

  // 🗣️ Generate Joey’s voice as tts.mp3
  await generatePollySpeech(text);

  res.json({ message: "Text received and Joey voice generated." });
});

// ---- GET: retrieve last text ----
app.get("/api/text", (req, res) => {
  res.json({ text: latestText });
});

// ---- Socket connection ----
io.on("connection", (socket) => {
  console.log("🔌 Client connected");
  if (latestText) socket.emit("new_text", latestText);
  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});