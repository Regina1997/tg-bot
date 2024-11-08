require('dotenv').config();
const { Bot, GrammyError, HttpError, InlineKeyboard, InputFile } = require("grammy");
const texts = require('./text');

const bot = new Bot(process.env.BOT_API_KEY);

const inlineKeyboard = new InlineKeyboard()
    .text('Консультация ☎️', 'lesson')
    .row()
    .text('Онлайн курс 🎓', 'course')
    .row()
    .text('Послушаю ваш трек 🎧', 'feedback');

bot.command("start", async (ctx) =>
    await ctx.reply(texts.text_start,
        {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: inlineKeyboard,
        },
    ));

bot.on("message", (ctx) => ctx.reply("Ой, я пока так не умею 🤓"));

bot.callbackQuery('course', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(texts.course,
        {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
        },
    )
});

const consult = new InlineKeyboard()
    .url('Записаться на консультацию', 'https://t.me/xrisvavrzhina')
    .row()
    .text('< Назад в меню', 'back');

bot.callbackQuery('lesson', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(texts.consult,
        { reply_markup: consult, }
    );
});

const feedback = new InlineKeyboard()
    .url('Получить фидбек', 'https://t.me/xrisvavrzhina')
    .row()
    .text('< Назад в меню', 'back');

bot.callbackQuery('lesson', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply(texts.feedback,
        { reply_markup: feedback, }
    );
});


const get_guide = new InlineKeyboard()
    .text('Забрать гайд', 'getguide')
    .row()
    .text('< Назад в меню', 'back');

bot.callbackQuery('guide', async (ctx) => {
    await ctx.answerCallbackQuery()
    await ctx.reply('Бесплатный гайд',
        { reply_markup: get_guide, }
    );

});

bot.callbackQuery('getguide', async (ctx) => {
    // Replace with the path to your PDF file
    await ctx.answerCallbackQuery('Гайд объемный! Надо подождать 🤏');
    const pdfPath = new InputFile("./files/guide.pdf");

    await ctx.replyWithDocument(pdfPath);
});


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
]);



bot.command('inline_keyboard', async (ctx) => {
    await ctx.reply('Чтобы заказать у меня консультацию, получить гайд или купить курс, нажмите одну из кнопок ниже:', {
        reply_markup: inlineKeyboard,
    });
});

bot.start();
