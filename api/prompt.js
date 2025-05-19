export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST requests allowed");
  }

  const { history } = req.body;
  if (!Array.isArray(history) || history.length === 0) {
    return res.status(400).json({ error: "Missing or invalid 'history'" });
  }

  // Combine chat history into a single prompt for the model.
  const prompt = history.map(msg => msg.content).join("\n");

  try {
    // Hugging Face Space endpoint URL (replace if your Space is different)
    const HF_API_URL = "https://hf.space/embed/GalacTechNyc/galactus2-lora/api/predict";

    const hfRes = await fetch(HF_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [prompt] })
    });

    // Try to parse JSON, but catch if it fails and dump the response text
    let hfData;
    try {
      hfData = await hfRes.json();
    } catch (parseErr) {
      const raw = await hfRes.text();
      console.error("❌ Failed to parse JSON. Raw response:", raw);
      return res.status(502).json({ error: "Invalid response from HuggingFace", raw });
    }

    const reply = Array.isArray(hfData.data) ? hfData.data[0] : (hfData.reply || "No response");

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ GalactusAI HuggingFace API error:", err);
    return res.status(500).json({ error: err.message || "GalactusAI failed to respond." });
  }
}