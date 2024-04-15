const TelegramApi = require("node-telegram-bot-api");

const token = `6896940302:AAFPFHRSdzkXQ-cm_rQG4EKU17r5zx2cemQ`;
const adminId = 1349073268;
const bot = new TelegramApi(token, { polling: true });

const options = {
  reply_markup: JSON.stringify({
    keyboard: [
      [{ text: "О нас" }],
      [{ text: "Виды йоги" }],
      [{ text: "Популярные вопросы" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }),
};

const options_yoga = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Йога 1", callback_data: "1" }],
      [{ text: "Йога 2", callback_data: "2" }],
      [{ text: "Йога 3", callback_data: "3" }],
      [{ text: "Йога 4", callback_data: "4" }],
      [{ text: "Йога 5", callback_data: "5" }],
      [{ text: "Йога 6", callback_data: "6" }],
      [{ text: "Йога 7", callback_data: "7" }],
    ],
  }),
};

let users = [];

bot.on("message", async (msg) => {
  console.log("Received message:", msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  const userId = msg.from.id;
  const userName = msg.from.username || "";
  const firstName = msg.from.first_name || "";
  if (!users.includes(chatId)) {
    users.push(chatId);
  }
  try {
    if (text === "/start") {
      await bot.sendMessage(chatId, `Hello, ${firstName}!`, options);
    } else if (text === "/admin") {
      if (userId == adminId) {
        await bot.sendMessage(chatId, "Вы вошли в админ панель");
      } else {
        await bot.sendMessage(chatId, "Вы не админ");
      }
    } else if (userId == adminId && !text.includes("/") & !text.includes("Виды")) {}
      users.forEach(async (user) => {
        await bot.sendMessage(user, text);
      });
    } else if (text === "О нас") {
      await bot.sendMessage(chatId, "О нас");
    } else if (text === "Виды йоги") {
      await bot.sendMessage(chatId, "Виды йоги:", options_yoga);
    } else if (text === "Популярные вопросы") {
      await bot.sendMessage(chatId, "Популярные вопросы");
    }
  } catch (error) {
    console.error("Error in message handler:", error);
  }
});

bot.on("callback_query", async (msg) => {
  const chatId = msg.message.chat.id;
  const data = msg.data;

  try {
    await bot.sendMessage(chatId, `Йога ${data}`);
  } catch (error) {
    console.error("Error in callback query handler:", error);
  }
});
