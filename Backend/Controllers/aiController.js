import { GoogleGenAI } from '@google/genai';

// Configure our system prompt
const SYSTEM_PROMPT = `
You are a compassionate, gentle food-support assistant for someone who might be struggling with eating or looking for safe foods.
The user wants exactly 10 food suggestions based perfectly on their parameters.
If they ask for more, return 10 completely NEW & DIFFERENT suggestions than what they'd typically get.
Return ONLY valid JSON. No markdown backticks, no conversational text.
Format exactly as:
[
  {
    "name": "Food Name",
    "description": "A very brief, gentle description making it sound manageable.",
    "type": "Solid/Liquid/Soft/etc",
    "temperature": "Hot/Cold/Warm/Frozen/etc"
  }
]
`;

export const getFoodSuggestions = async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { mealSize, temperature, foodType } = req.body;

    if (!mealSize || !temperature || !foodType) {
      return res.status(400).json({
        success: false,
        message: "mealSize, temperature, and foodType are required parameters.",
      });
    }

    const userInput = `
    Generate 10 safe food ideas with these characteristics:
    - Meal Volume/Size: ${mealSize}
    - Avoid these temperatures (if any): ${temperature} (Suggest things OUTSIDE of this temperature if they specified one to avoid, or stick to safe ones. Wait, the app asks "Would you like to avoid any temperatures?". 
      If temperature = 'Hot', do NOT suggest hot foods. Suggest cold/warm/frozen.
      If temperature = 'Nothing', then anything is fine.)
    - Food Type Preference: ${foodType}

    Please return a JSON array of 10 items.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Add some randomness for "Show More" variety
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
