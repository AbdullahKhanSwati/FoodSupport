import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `Test prompt`;

async function main() {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const userInput = "Generate 3 safe food ideas with these characteristics: ...";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userInput,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                responseMimeType: "application/json",
            }
        });
        
        console.log("Success text:", response.text);
    } catch(e) {
        console.error("AI Error:", e);
    }
}
main();
