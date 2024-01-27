import match from './match'
import room from './room'
import player from './player'
import item from './item'

export default function (socket: any, io: any) {
    const playerRoute = new player(socket, io)
    const itemRoute = new item(socket, io)

    socket.on('rooms/create', async () => await room.create(socket, io)())
    socket.on(
        'rooms/players/add',
        async ({ idRoom }: { idRoom: string }) => await room.add(socket, io)({ idRoom }),
    )
    socket.on('rooms/players/goOut', async () => await room.goOut(socket, io)())
    socket.on(
        'rooms/players/ready',
        async ({ idRoom, isReady }: { idRoom: string; isReady: boolean }) =>
            await room.ready(socket, io)({ idRoom, isReady }),
    )
    socket.on(
        'rooms/players/change-position',
        async ({ idRoom, position }: { idRoom: string; position: any }) =>
            await room.changePosition(socket, io)({ idRoom, position }),
    )
    socket.on(
        'rooms/players/delete',
        async ({ _id }: { _id: string }) => await room.deletePlayer(socket, io)({ _id }),
    )

    socket.on(
        'matches/loaded',
        async ({ idMatch, idRoom }: { idMatch: string; idRoom: string }) =>
            await match.loadedDataObject(socket, io)({ idMatch, idRoom }),
    )

    socket.on(
        'items/wear-or-unbind',
        async (data: any, callback: any) => await itemRoute.wearOrUnbindEquip(data, callback),
    )

    socket.on('player/friends/add', async (data: any) => await playerRoute.addFriend(data))
    socket.on('player/friends/add/res-add', async (data: any) => await playerRoute.saveFriend(data))
}
