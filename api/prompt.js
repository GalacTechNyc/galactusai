import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  const { history, model } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "Missing or invalid 'history'" });
  }

  try {
    if (model === "gemini") {
      const promptText = history.map((msg) => `${msg.role === "user" ? "You" : "AI"}: ${msg.content}`).join("\n");
      const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await geminiModel.generateContent(promptText);
      const reply = result.response.text();
      return res.status(200).json({ reply });
    } else {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: history,
      });
      const reply = completion.choices[0].message.content;
      return res.status(200).json({ reply });
    }
  } catch (err) {
    console.error("❌ GalactusAI API error:", err);
    return res.status(500).json({ error: err.message || "GalactusAI failed to respond." });
  }
}