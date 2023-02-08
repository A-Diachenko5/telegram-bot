const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6132090183:AAFTgW1VHPz3rlncsOT5XOjQC-vZWBjOuRU'
const bot = new TelegramApi(token, {polling: true})
const chats = {}

const startGame = async (chatId) =>{
    const randomNumder = Math.floor(Math.random()*10)
    chats[chatId] = randomNumder
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () =>{
    bot.setMyCommands([
        {command:'/start', description:'Приветствие'},
        {command:'/info', description:'Информация'},
        {command:'/game', description:'Игра'}
    ])
    
    bot.on("message", async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if(text === "/start") {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/2.webp')
            return bot.sendMessage(chatId, "Добро пожаловать в закрытый клуб людей которые создают хуевых ботов в телеграм")
        }
    
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
        }

        if(text === '/game') {
            await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты попрогуй угадать)))0))`)
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "Такого я не знаю")
    })
}

bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    
    if(data === '/again'){
        startGame(chatId)
    } else if(data == chats[chatId]) {
        return  bot.sendMessage(chatId, `ЭТО ЧЕРТ ПОБЕРИ ВЕРНО`)
    } else if (data === undefined){
        return  bot.sendMessage(chatId, `Сука`)
    } else if(data !== chats[chatId]){
        console.log(chats[chatId])
        console.log(data)
        return  bot.sendMessage(chatId, `НЕПРАВИЛЬНО ${chats[chatId]}`, againOptions)
    }
})

start()