
require("./server");
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const chat = require("./ai");
const { saveChat, getMemory } = require("./mongo");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("Telegram bot started...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hey 😊 I'm your AI chatbot. Talk with me!");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  try {

    await bot.sendChatAction(chatId, "typing");

    let memory = [];
    try {
      memory = await getMemory(chatId);
    } catch (dbErr) {
      console.log("MongoDB memory error:", dbErr.message);
    }

    let reply = "Hmm... I couldn't think of a reply 🤔";

    try {
      reply = await chat(memory, text);
    } catch (aiErr) {
      console.log("AI error:", aiErr.message);
      reply = "AI service is not responding right now 🤖";
    }

    try {
      await saveChat(chatId, "user", text);
      await saveChat(chatId, "assistant", reply);
    } catch (saveErr) {
      console.log("MongoDB save error:", saveErr.message);
    }

    bot.sendMessage(chatId, reply);

  } catch (err) {
    console.log("General bot error:", err.message);
    bot.sendMessage(chatId, "Temporary server issue. Try again later.");
  }
});
