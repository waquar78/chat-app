import { askAI } from "../services/aiService.js";

export async function chatWithAI(req, res) {
  try {
    const { assistantType, text } = req.body;
    const reply = await askAI({ assistantType, text });
    res.json({ reply });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "AI failed" });
  }
}
