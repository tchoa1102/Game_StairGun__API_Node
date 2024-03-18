export default interface IResPLayerAfterBattle {
    target: { _id: string }
    damages: Array<number>
    HP: number
}

export class ResPLayerAfterBattle implements IResPLayerAfterBattle {
    target: { _id: string }
    damages: number[] = []
    HP: number

    constructor(playerId: string, hp: number) {
        this.target = { _id: playerId }
        this.HP = hp
    }
}
