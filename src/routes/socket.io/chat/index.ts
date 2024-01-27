import Chat from '../../../services/chat/chat'

export default function (socket: any, io: any) {
    const chat = new Chat(socket, io)
    // socket.on('send-message', (data) => chat.testMessage(data))
    socket.on(
        'chat/send',
        async (data: any, callback: any) => await chat.sendMessage(data, callback),
    )
}
