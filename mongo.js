
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const chatSchema = new mongoose.Schema({
  chatId: String,
  role: String,
  content: String,
});

const Chat = mongoose.model("Chat", chatSchema);

async function saveChat(chatId, role, content) {
  await Chat.create({ chatId, role, content });
}

async function getMemory(chatId) {
  return Chat.find({ chatId })
    .sort({ _id: -1 })
    .limit(10)
    .then((r) => r.reverse());
}

module.exports = { saveChat, getMemory };
