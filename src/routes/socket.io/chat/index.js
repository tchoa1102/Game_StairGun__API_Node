const Chat = require('./chat')

module.exports = function (socket, io) {
    const chat = new Chat(socket, io)
    // socket.on('send-message', (data) => chat.testMessage(data))
    socket.on('chat/send', async (data, callback) => await chat.sendMessage(data, callback))
}
