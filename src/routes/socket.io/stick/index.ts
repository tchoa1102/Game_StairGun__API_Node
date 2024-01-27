import Stick from './stick'

export default async function (socket: any, io: any) {
    // y = -(2/25)x^(2) + 8x
    const stick = new Stick(socket, io)
    socket.on('stick-stand', ({ event }: { event: any }) => stick.stand({ event }))

    socket.on('stick-left', ({ event }: { event: any }) => stick.left({ event }))

    socket.on('stick-right', ({ event }: { event: any }) => stick.right({ event }))

    socket.on('stick-jump-left', ({ event }: { event: any }) => stick.jumpLeft({ event }))

    socket.on('stick-jump-right', ({ event }: { event: any }) => stick.jumpRight({ event }))
}
