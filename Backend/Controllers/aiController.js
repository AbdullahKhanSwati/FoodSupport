import { GoogleGenAI } from '@google/genai';
import SafeFood from '../Models/SafeFood.js';

// Configure our system prompt
const SYSTEM_PROMPT = `
You are a compassionate, gentle food-support assistant for someone who might be struggling with eating or looking for safe foods.
The user wants exactly 8 food suggestions based perfectly on their parameters.
You will also be provided with the user's list of previously saved "safe foods" — foods they already trust and enjoy.
Use these saved foods as strong inspiration: recommend foods that share similar ingredients, textures, flavor profiles, preparation styles, or emotional feel as the saved ones.
Do NOT simply repeat the saved foods — suggest NEW foods that feel familiar and comfortable given what they already eat.
If the user has no saved foods yet, base suggestions purely on their chosen parameters.
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
]
`;

export const getFoodSuggestions = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { mealSize, temperature, foodType } = req.body;
    const userId = req.user?.id;

    if (!mealSize || !temperature || !foodType) {
      return res.status(400).json({
        success: false,
        message: "mealSize, temperature, and foodType are required parameters.",
      });
    }

    // Fetch user's saved safe foods to use as inspiration
    const savedFoods = await SafeFood.find({ userId })
      .select('name description type temperature mealSize')
      .sort({ isFavorite: -1, createdAt: -1 })
      .limit(50)
      .lean();

    const savedFoodsContext = savedFoods.length
      ? savedFoods
          .map(
            (f, i) =>
              `${i + 1}. ${f.name} — ${f.type}, ${f.temperature}${
                f.description ? ` (${f.description})` : ''
              }`
          )
          .join('\n')
      : 'The user has not saved any foods yet.';

    const userInput = `
    Generate 8 safe food ideas with these characteristics:
    - Meal Volume/Size: ${mealSize}
    - Avoid these temperatures (if any): ${temperature} (Suggest things OUTSIDE of this temperature if they specified one to avoid, or stick to safe ones.
      If temperature = 'Hot', do NOT suggest hot foods. Suggest cold/warm/frozen.
      If temperature = 'Nothing', then anything is fine.)
    - Food Type Preference: ${foodType}

    The user's previously saved safe foods (use these as strong inspiration for style, texture, and comfort level — but suggest NEW foods, do not just repeat these):
    ${savedFoodsContext}

    Please return a JSON array of 8 items. Each suggestion should feel familiar and comfortable to someone who eats the saved foods listed above. Include a highly detailed, step-by-step recipe/preparation guide for each food so the user knows exactly how to make it.
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

    const text = response.text;

    // Parse the JSON safely
    let suggestions = [];
    try {
      suggestions = JSON.parse(text);
    } catch (parseError) {
      // Fallback regex cleaning if the model wraps it in Markdown
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         suggestions = JSON.parse(jsonMatch[0]);
      } else {
         throw new Error("Could not parse JSON from AI response");
      }
    }

    return res.status(200).json({
      success: true,
      data: suggestions,
    });

  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate AI food suggestions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
