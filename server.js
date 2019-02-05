const Eris = require("eris");
const { VoiceText } = require('voice-text');
const { writeFileSync } = require('fs');
const Tokens = {
    ttsAPI: '', // VoiceTextAPIのトークン
    discord: '' // Discordのトークン
};

const voiceText = new VoiceText(Tokens.ttsAPI);
const bot = new Eris(Tokens.discord);
// console.log(Tokens)
var connection = null;
var textBuffer = [];
const ChannelName = 'General'
var userVoice = {};
const VoiceTable = ['hikari', 'haruka', 'takeru', 'santa', 'bear', 'show']

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
});

bot.on("voiceChannelJoin", (member, newChannel) => {
    console.log("channelRecipientAdd");
    bot.joinVoiceChannel(newChannel.id).then((con) => {
        connection = con;
        connection.on('end', () => {
            if (textBuffer.length) {
                connection.play(getYomiageStream(textBuffer.shift()))
            }
        })
    });

    var text = member.username + 'が参加しました';
    var arr = text.split(' ')

    if (!connection) { return }

    var voice = 'haruka';
    if (connection.playing) {
        textBuffer.push({
            voice: voice,
            msg: text
        })
    } else {
        var stream = getYomiageStream({
            voice: voice,
            msg: text
        })
        connection.play(stream)
    }
})

function getYomiageStream(obj) {
    return voiceText.stream(obj.msg, {
        speaker: obj.voice
    })
}
bot.connect(); // Get the bot to connect to Discord
