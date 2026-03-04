
const OpenAI = require("openai");
const fs = require("fs");

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is missing.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let personality = "You are a friendly AI chatbot.";
try {
  personality = fs.readFileSync("./personality.txt", "utf8");
} catch (e) {
  console.log("personality.txt not found, using default.");
}

async function chat(memory, message) {
  try {
    const messages = [
      { role: "system", content: personality },
      ...(memory || []),
      { role: "user", content: message }
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages
    });

    return response.choices?.[0]?.message?.content || "I couldn't generate a reply.";
  } catch (err) {
    console.error("OpenAI error:", err.response?.data || err.message);
    return "AI temporary error. Try again.";
  }
}

module.exports = chat;
