const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function test() {
    console.log("Testing gemini-1.5-flash specifically...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    try {
        const result = await model.generateContent("Say hello");
        console.log("Success:", result.response.text());
    } catch (err) {
        console.error("Failed:", err.message);
    }
}

test();
