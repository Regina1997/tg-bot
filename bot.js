require('dotenv').config();
const { Bot, GrammyError, HttpError, InlineKeyboard } = require("grammy");
const fs = require("fs");

const bot = new Bot(process.env.BOT_API_KEY);

const inlineKeyboard = new InlineKeyboard()
    .text('Консультация', 'lesson')
    .text('Онлайн курс', 'course')
    .text('Бесплатный гайд', 'guide');

bot.command("start", async (ctx) =>
    await ctx.reply(`Привет! Меня зовут Хрис Вавржина, автор курса по написанию музыки «The Lazy Producer или как за 1,5 месяца написать трек и не потерять вдохновение». \nПодпишись на <a href="https://t.me/xris_vavrzhina">Telegram-канал</a> «The lazy producer. Все о техно.» \nЧтобы заказать у меня консультацию, получить гайд или купить курс, нажмите одну из кнопок ниже:`,
        {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: inlineKeyboard,
        },
    ));

bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.callbackQuery('course', async (ctx) => {
    await ctx.reply(`Мой авторский курс  <a href="https://www.thelazyproducer.ru/course">«The Lazy Producer или как за 1,5 месяца написать трек и не потерять вдохновение»</a> с заботой разложен на 4 модуля, чтобы процесс обучения приносил удовольствие. Благодаря четко выстроенной системе, через 1,5 месяца вы получаете готовый трек, и логику, которая поможет вам быстро приходить к своей цели, всегда доводить свои треки до конца и кайфовать в процессе.`,
        {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        },
    )
});

bot.callbackQuery('lesson', async (ctx) => {
    await ctx.reply('Онлайн курс');
});

const get_guide = new InlineKeyboard()
    .text('Забрать гайд', 'getguide')

bot.callbackQuery('guide', async (ctx) => {
    await ctx.reply('Бесплатный гайд',
        { reply_markup: get_guide, }
    );

});

bot.callbackQuery('getguide', async (ctx) => {
    try {
        // Путь к вашему PDF-файлу
        const pdfPath = "./files/guide.pdf";

        // Проверяем, существует ли файл
        if (!fs.existsSync(pdfPath)) {
            return ctx.reply("Файл не найден.");
        }

        // Отправляем PDF файл
        await ctx.replyWithDocument({
            source: fs.createReadStream(pdfPath),
            filename: "guide.pdf" // имя файла при отправке
        });

    } catch (error) {
        console.error("Ошибка отправки PDF:", error);
        ctx.reply("Произошла ошибка при отправке файла.");
    }
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`); const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
});

bot.api.setMyCommands([
    { command: 'start', description: 'Запуск бота' },
    { command: 'say_hello', description: 'Получить приветствие' },
    { command: 'hello', description: 'Получить приветствие' },
    { command: 'say_hi', description: 'Получить приветствие' },
]);



bot.command('inline_keyboard', async (ctx) => {
    await ctx.reply('Чтобы заказать у меня консультацию, получить гайд или купить курс, нажмите одну из кнопок ниже:', {
        reply_markup: inlineKeyboard,
    });
});

bot.start();
