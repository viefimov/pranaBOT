const TelegramApi = require("node-telegram-bot-api");
const { texts, yoga } = require("./texts");
const token = `6896940302:AAFPFHRSdzkXQ-cm_rQG4EKU17r5zx2cemQ`;
const adminId = [1349073268, 248956395];
const bot = new TelegramApi(token, {
  polling: true,
  fileOptions: { useMimeType: true },
});

const options = {
  reply_markup: JSON.stringify({
    keyboard: [
      [{ text: "О нас" }, { text: "Виды практик" }],
      [{ text: "Мероприятия" }, { text: "Популярные вопросы" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }),
};
const options_faq = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Как записаться в сауну/флоатинг?", callback_data: "faq1" }],
      [
        {
          text: "Я преподаватель. Как арендовать зал для занятий?",
          callback_data: "faq2",
        },
      ],
      [{ text: "Что нужно брать с собой на занятие?", callback_data: "faq3" }],
      [
        {
          text: "Где я могу посмотреть актуальное расписание на неделю?",
          callback_data: "faq4",
        },
      ],
      [{ text: "Как записаться на занятие?", callback_data: "faq5" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }),
};

const options_events = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Лила", callback_data: "lila" }],
      [{ text: "Садхана", callback_data: "sadhana" }],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  }),
};
const options_yoga = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Кундалини", callback_data: "1" },
        { text: "Стретчинг", callback_data: "2" },
      ],
      [
        { text: "Стопы и спина", callback_data: "3" },
        { text: "Хатха йога", callback_data: "4" },
      ],
      [
        { text: "Осанка и спина (дети)", callback_data: "5" },
        { text: "Суставная гимнастика", callback_data: "6" },
      ],
      [
        { text: "Восточные танцы", callback_data: "7" },
        { text: "Йога для беременных", callback_data: "8" },
      ],
      [
        { text: "Звукотерапия", callback_data: "9" },
        { text: "Женский круг", callback_data: "10" },
      ],
      [
        { text: "Кали медитация", callback_data: "11" },
        { text: "Нейрографика", callback_data: "12" },
      ],
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
  if (!users.includes(userId)) {
    users.push(userId);
  }
  try {
    if (text === "/start") {
      await bot.sendMessage(chatId, `${userId} , ${chatId}`, options);
    } else if (text === "О нас") {
      await bot.sendPhoto(chatId, texts.about.photo, {
        caption: texts.about.text,
        parse_mode: "Markdown",
      });
    } else if (text === "Виды практик") {
      await bot.sendMessage(
        chatId,
        "Выберите интересуюущю вас практику чтобы посмотреть узнать подробную информацию:",
        options_yoga
      );
    } else if (text === "Популярные вопросы") {
      await bot.sendMessage(
        chatId,
        "Выберите ниже вопрос, который вас интересует, чтобы узнать подробную информацию:",
        options_faq
      );
    } else if (text === "Мероприятия") {
      await bot.sendMessage(
        chatId,
        "На данный момент в Пране проводятся следующие мероприятия:",
        options_events
      );
    } else if (!adminId.includes(userId)) {
      await bot.sendMessage(chatId, "Я вас не понимаю");
    }
  } catch (error) {
    console.error("Error in message handler:", error);
  }
});

bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.caption;
  const photo = msg.photo[0].file_id;
  const userId = msg.from.id;
  if (adminId.includes(userId)) {
    users.forEach(async (user) => {
      if (adminId.includes(user)) {
        await bot.sendMessage(chatId, "Пост опубликован");
      } else {
        await bot.sendPhoto(user, photo, { caption: text });
      }
    });
  }
});

bot.on("callback_query", async (msg) => {
  const chatId = msg.message.chat.id;
  const data = msg.data;

  try {
    if ("photo" in yoga[data]) {
      await bot.sendPhoto(
        chatId,
        yoga[data].photo,
        {
          caption: yoga[data].text,
          parse_mode: "Markdown",
        },
        yoga[data].options
      );
    } else {
      await bot.sendMessage(chatId, yoga[data].text, yoga[data].options);
    }
  } catch (error) {
    console.error("Error in callback query handler:", error);
  }
});
