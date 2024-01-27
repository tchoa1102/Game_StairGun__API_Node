import mongoose from 'mongoose'
import { MatchModel, PlayerOnMatchModel } from '../../../../app/models'

class match {
    constructor() {}

    // on: matches/loaded | emit: matches/players/loaded/res, matches/start/res
    loadedDataObject(socket: any, io: any) {
        return async ({ idMatch, idRoom }: { idMatch: string; idRoom: string }) => {
            const idPlayer = socket.handshake.idPlayer

            try {
                console.log('Loaded data object')
                const matchDataRaw: any = await MatchModel.findById(idMatch).lean()
                const playersOnMatch = await PlayerOnMatchModel.find({
                    match: matchDataRaw._id,
                }).lean()

                const dataMatch = {
                    numOfLoaded: 1,

                    timeStart: matchDataRaw.timeStart,
                    stairs: matchDataRaw.stairs.map((stair: any) => ({ ...stair })),
                    players: playersOnMatch.reduce((result: any, player: any) => {
                        result[player.target.toString()] = {}
                        result[player.target.toString()] = {
                            ...player,
                            mainGame: { ...player.mainGame },
                            stairGame: { ...player.stairGame },
                        }

                        return result
                    }, {}),
                    // cards: matchDataRaw.cards.map((card) => ({ ...card })),
                }

                const result = await PlayerOnMatchModel.updateOne(
                    { target: idPlayer, match: new mongoose.Types.ObjectId(idMatch) },
                    { isLoaded: true },
                )

                console.log('idMatch: ', idMatch, '; idRoom: ', idRoom, 'result update: ', result)

                // socket.handshake.match = dataMatch

                const allPlayerLoaded = playersOnMatch.every((player: any) => {
                    if (player.target.toString() === idPlayer) return true
                    return player.isLoaded
                })
                if (allPlayerLoaded) {
                    console.log('action game')
                    setTimeout(
                        ([idRoom]) => {
                            io.to(idRoom).emit('matches/start/res')
                        },
                        5000,
                        [idRoom],
                    )
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}

export default new match()
