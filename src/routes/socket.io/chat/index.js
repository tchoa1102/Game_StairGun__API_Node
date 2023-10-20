const Chat = require('./chat')

module.exports = function (socket, io) {
    const chat = new Chat(socket, io)
    socket.on('send-message', (data) => chat.testMessage(data))
}
