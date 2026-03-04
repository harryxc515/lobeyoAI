
const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const personality = fs.readFileSync("./personality.txt", "utf8");

async function chat(memory, message) {
  const messages = [
    { role: "system", content: personality },
    ...memory,
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
  });

  return completion.choices[0].message.content;
}

module.exports = chat;
