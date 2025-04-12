const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDxJ0NLc6H7p-lWFBN6AtDwb365i9GmK-8";

const genAI = new GoogleGenerativeAI(API_KEY);

const generatePrompt = (userData) => {
  return `
    Based on the user data below, generate an exercise plan for a week.
    User data:
    ${JSON.stringify(userData)}
    
    Generate 3 exercises per day.
    Saturday and Sunday as rest days.
    
    Sample output JSON:
    [{"day": "Monday","exercises": [{"exercise": "...", "sets": "...", "reps": "...", "weight": "...","rest": "..."}]}]
    
    "reps" in JSON is a string with number of reps with weight if needed
    "rest" in JSON is the rest to be taken between sets
    "weight" in JSON is the weight to be used for exercise, it should be with units if needed e.g. 10 kgs, else make it "2kgs",do not ignore to mention it
    
    For rest days return only one javascript object in exercises array with exercise field as "Rest Day" and remaining fields as "---" (Weekends need not to be Rest Days but make to keep atleast one rest day in a week)
    
    Answer:
  `;
};

const extractJSON = (output) => {
  const jsonStartIndex = output.indexOf("[");
  const jsonEndIndex = output.lastIndexOf("]") + 1;
  const json = output.substring(jsonStartIndex, jsonEndIndex);
  return JSON.parse(json);
};

const generateText = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return extractJSON(text);
  } catch (e) {
    console.error("Gemini API error:", e);
    throw new Error(e.message);
  }
};

module.exports = {
  generatePrompt,
  generateText,
};
