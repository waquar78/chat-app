import { GoogleGenerativeAI } from "@google/generative-ai";
import { assistantPrompts } from "../prompts/assistantPrompts.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askAI({ assistantType, text }) {
  let systemPrompt = assistantPrompts[assistantType] || assistantPrompts.normal;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    systemPrompt,
    `User: ${text}`
  ]);

  return result.response.text();
}
