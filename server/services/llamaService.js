const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const OPENAI_API_KEY = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnaXRodWJ8MTU3Njg2Mzc4Iiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MiLCJpc3MiOiJhcGlfa2V5X2lzc3VlciIsImF1ZCI6WyJodHRwczovL25lYml1cy1pbmZlcmVuY2UuZXUuYXV0aDAuY29tL2FwaS92Mi8iXSwiZXhwIjoxOTAwMzE0OTg2LCJ1dWlkIjoiNTg0MjFkMDctODdkOC00MGEzLWFhN2ItYzc1OTE3ZDczODI1IiwibmFtZSI6ImltYWdlZ2VuIiwiZXhwaXJlc19hdCI6IjIwMzAtMDMtMjFUMDk6MTY6MjYrMDAwMCJ9.XQQcLTRZawdi0QmfDFfBqA29NRSln2Wexb77t0EwK_4';

if (!OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key. Set OPENAI_API_KEY in the environment.");
}

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.ai/v1/',
  apiKey: OPENAI_API_KEY,
});

const generateMealPlan = async (preferences, allergies, pantryItems, calorieTarget, additionalInstructions = '') => {
  try {
    const prompt = `
      Generate a 1-day meal plan (breakfast, lunch, and dinner) based on:
      
      - Dietary preferences: ${preferences.join(', ') || 'None'}
      - Allergies to avoid: ${allergies.join(', ') || 'None'}
      - Available pantry items: ${pantryItems.join(', ') || 'None'}
      - Daily calorie target: ${calorieTarget || 2000} calories
      
      ${additionalInstructions ? `Additional instructions: ${additionalInstructions}` : ''}
      
      Output format:
      {
        "days": [
          {
            "day": "Meal Plan",
            "meals": [
              {
                "type": "Breakfast",
                "name": "Meal name",
                "ingredients": ["ingredient 1", "ingredient 2"],
                "instructions": "Cooking instructions",
                "prepTime": 15,
                "calories": 400,
                "protein": 20,
                "carbs": 30,
                "fat": 15
              }
            ]
          }
        ]
      }
    `;
    
    console.log('🔹 Sending Prompt to AI:', prompt);
    
    const response = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-fast",
      max_tokens: 1500,
      temperature: 0.7,
      top_p: 0.9,
      extra_body: { top_k: 50 },
      messages: [
        {
          role: "system", 
          content: "You are a helpful meal planning assistant that creates personalized meal plans based on dietary preferences, allergies, and available ingredients."
        },
        {
          role: "user", 
          content: prompt
        }
      ]
    });

    if (!response || !response.choices || !response.choices.length) {
      throw new Error("Invalid response format from AI API.");
    }

    const rawResponse = response.choices[0].message.content;
    console.log("\n\n****"+rawResponse+"*****\n\n")
    console.log("🔹 Raw AI Response generated successfuly.");

    const jsonStr = extractJsonFromText(rawResponse);
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("❌ JSON Parsing Error:", parseError.message);
      console.error("🚨 AI Response (before parsing):", jsonStr);
      throw new Error("Failed to parse AI response as JSON.");
    }
    
  } catch (error) {
    console.error('❌ Error generating meal plan:', error.message);
    throw new Error('Failed to generate meal plan: ' + error.message);
  }
};


function extractJsonFromText(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  
  if (jsonMatch) {
    return jsonMatch[0]; 
  }
  
  console.warn("⚠️ No valid JSON found in AI response. Returning fallback.");
  return JSON.stringify({
    days: [
      {
        day: "Day 1",
        meals: [
          { 
            type: "Breakfast", 
            name: "Default breakfast", 
            ingredients: ["Ingredients not parsed"], 
            instructions: text,
            prepTime: 30,
            calories: 300,
            protein: 15,
            carbs: 30,
            fat: 10
          }
        ]
      }
    ]
  });
}



const generateChatbotResponse = async (userMessage, history = [], userPreferences = null) => {
  try {
    
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content
    })).slice(-6); 
    
    let systemMessage = "You are Chef Byte, an energetic, funny, and optimistic AI assistant specializing in dietary advice, nutrition, and meal planning.";
    
    if (userPreferences) {
      systemMessage += " The user has the following dietary preferences:";
      
      if (userPreferences.dietaryPreferences && userPreferences.dietaryPreferences.length > 0) {
        systemMessage += ` Dietary preferences: ${userPreferences.dietaryPreferences.join(', ')}.`;
      }
      
      if (userPreferences.allergies && userPreferences.allergies.length > 0) {
        systemMessage += ` Allergies: ${userPreferences.allergies.join(', ')}.`;
      }
      
      if (userPreferences.calorieTarget) {
        systemMessage += ` Daily calorie target: ${userPreferences.calorieTarget} calories.`;
      }
    }
    
    systemMessage += `
    Your personality traits:
    - Super energetic and enthusiastic about healthy eating
    - Optimistic and encouraging about dietary changes
    - Funny and witty, using food puns and jokes frequently
    - Supportive and positive, never judgmental
    - Knowledgeable but explains things in simple, relatable terms
    
    Response style and formatting:
    - Keep responses very concise (under 120 words)
    - Use Markdown formatting for structure and emphasis
    - Use **bold** for important points
    - Use bullet lists for multiple items or steps
    - Use emojis sparingly (1-2 per response maximum)
    - Include a touch of humor in most responses
    - Be conversational and friendly
    - Provide practical, actionable advice
    - When listing recipes or food items, use bullet points or numbered lists
    - Never be verbose or overly detailed
    `;

    const messages = [
      { role: "system", content: systemMessage }
    ];
 
    if (formattedHistory.length > 0) {
      messages.push(...formattedHistory);
    } else {
      messages.push({ role: "user", content: userMessage });
    }

    const response = await client.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      max_tokens: 250,  
      temperature: 0.7, 
      extra_body: {
        top_k: 50
      },
      messages: messages
    });

    const responseText = response.choices[0].message.content;
    return responseText;
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    throw new Error('Failed to generate chatbot response: ' + error.message);
  }
};




module.exports = { 
  generateMealPlan,
  generateChatbotResponse
};

