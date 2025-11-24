import { GoogleGenAI } from "@google/genai";

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const prompt = body.prompt;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,  // ← ここは安全
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
}
