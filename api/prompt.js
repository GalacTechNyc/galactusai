import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  const { history } = req.body;

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "Missing or invalid 'history'" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: history,
    });
    const reply = completion.choices[0].message.content;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ GalactusAI API error:", err);
    return res.status(500).json({ error: err.message || "GalactusAI failed to respond." });
  }
}