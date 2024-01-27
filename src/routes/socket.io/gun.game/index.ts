import GunGame from '../../../services/gunGame'

export default function (socket: any, io: any) {
    const gunGame = new GunGame(socket, io)
    const baseUrl = gunGame.baseUrl
    // gunGame.gun({ angle: 35, velocity_0: 26 })

    socket.on(baseUrl + '/lie', (data: any) => gunGame.lie(data))
    socket.on(baseUrl + '/to-left', (data: any) => gunGame.toLeft())
    socket.on(baseUrl + '/to-right', (data: any) => gunGame.toRight())
    socket.on(baseUrl + '/gun', (data: any, callback: any) => gunGame.gun(data, callback))
    socket.on(baseUrl + '/use-card', (data: any, callback: any) => gunGame.useCard(data, callback))
    socket.on(baseUrl + '/use-skill', (data: any, callback: any) =>
        gunGame.useSkill(data, callback),
    )
    socket.on(baseUrl + '/choose-velocity', (data: any, callback: any) =>
        gunGame.chooseVelocity(data, callback),
    )
}
