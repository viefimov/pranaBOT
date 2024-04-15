const { Client } = require("pg");
const TelegramApi = require("node-telegram-bot-api");

// Setup PostgreSQL client
const client = new Client({
  user: "pranadb_correctto",
  host: "yps.h.filess.io",
  database: "pranadb_correctto",
  password: "567599d7000dd31fd490a05393f5ff5dc0a4c183",
  port: 5432,
});
client.connect();

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminId = process.env.ADMIN_ID;
const bot = new TelegramApi(token, { polling: false });

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

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      bot.processUpdate(req.body);
      res.status(200).send("Webhook received");
    } catch (error) {
      console.error("Error processing update:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

bot.on("message", async (msg) => {
  console.log("Received message:", msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  const userId = msg.from.id;
  const userName = msg.from.username || "";
  const firstName = msg.from.first_name || "";
  try {
    if (text === "/start") {
      const userExists = await client.query(
        "SELECT * FROM myschema.users WHERE id = $1",
        [chatId]
      );
      if (userExists.rows.length === 0) {
        await client.query(
          "INSERT INTO myschema.users (id, username, first_name) VALUES ($1, $2, $3)",
          [chatId, userName, firstName]
        );
      }
      await bot.sendMessage(chatId, `Hello! ${msg.from.first_name}`, options);
    } else if (text === "/admin") {
      if (userId == adminId) {
        await bot.sendMessage(chatId, "Вы вошли в админ панель");
      } else {
        await bot.sendMessage(chatId, "Вы не админ");
      }
    } else if (userId == adminId && !text.includes("/")) {
      const users = await client.query("SELECT id FROM myschema.users");
      users.rows.forEach(async (user) => {
        await bot.sendMessage(user.id, text);
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
