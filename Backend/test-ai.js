import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `You are a compassionate, gentle food-support assistant for someone who might be struggling with eating or looking for safe foods.
The user wants exactly 3 food suggestions based perfectly on their parameters.
If they ask for more, return 3 completely NEW & DIFFERENT suggestions than what they'd typically get.
Return ONLY valid JSON. No markdown backticks, no conversational text.
Format exactly as:
[
  {
    "name": "Food Name",
    "description": "A very brief, gentle description making it sound manageable.",
    "recipe": "A detailed, step-by-step comprehensive recipe including ingredients and preparation instructions.",
    "type": "Solid/Liquid/Soft/etc",
    "temperature": "Hot/Cold/Warm/Frozen/etc"
  }
]`;

async function run() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const userInput = `
    Generate 3 safe food ideas with these characteristics:
    - Meal Volume/Size: Small
    - Avoid these temperatures (if any): Hot
    - Food Type Preference: Liquid

    Please return a JSON array of 3 items. Include a highly detailed, step-by-step recipe/preparation guide for each food so the user knows exactly how to make it.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        responseMimeType: "application/json",
      }
    });

    console.log("Success:", response.text);
  } catch (error) {
    console.error("AI Error:", error);
  }
}

run();
