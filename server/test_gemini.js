const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config({ path: 'c:/Users/borea/.gemini/antigravity/scratch/integrity/server/.env' });

async function test() {
    console.log("Using Key:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
    try {
        console.log("Listing model names...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        if (data.models) {
            console.log(data.models.map(m => m.name));
        } else {
            console.log("Error in response:", data);
        }
    } catch (err) {
        console.error("Failed to list models:", err.message);
    }
}

test();
