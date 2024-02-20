// Import your models here
import { CardModel, ItemModel, MapModel, ObjectModel } from '../src/app/models'
import dataItems from '../src/app/basedb/items.json'
import dataCards from '../src/app/basedb/cards.json'
import dataMaps from '../src/app/basedb/maps.json'
import dataObjects from '../src/app/basedb/objects.json'
import { Types } from 'mongoose'
import cardModel from '../src/app/models/card.model'
import db from '../src/config/db'

export async function up(): Promise<void> {
    // Write migration here
    try {
        await db.connect()
        const items = convert(dataItems)
        const cards = convert(dataCards)
        const maps = convert(dataMaps)
        const obj = convert(dataObjects)
        await ItemModel.create(items)
        await CardModel.create(cards)
        await MapModel.create(maps)
        await ObjectModel.create(obj)
    } catch (error) {
        console.log('Error migration: \n', error)
    }
}

export async function down(): Promise<void> {
    // Write migration here
}

function convert(data: Array<Record<string, any>>): Array<Record<string, any>> {
    return data.map((item) => {
        Array.from(Object.keys(item)).forEach((key: string) => {
            const value = item[key]
            if (Array.isArray(value)) {
                item[key] = convert(value)
                // array is object
            } else if (typeof value === 'object' && value.hasOwnProperty('$oid')) {
                item[key] = new Types.ObjectId(value.$oid)
            }
        })
        return item
    })
}
