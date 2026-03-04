
require("./server");
require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const chat = require("./ai");
const { saveChat, getMemory } = require("./mongo");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("Telegram bot started...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Hey 😊 I'm your AI chat bot. Talk to me!");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  try {
    await bot.sendChatAction(chatId, "typing");

    const memory = await getMemory(chatId);
    const reply = await chat(memory, text);

    await saveChat(chatId, "user", text);
    await saveChat(chatId, "assistant", reply);

    bot.sendMessage(chatId, reply);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "Something went wrong 😔");
  }
});
