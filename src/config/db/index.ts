import mongoose from 'mongoose'

async function main(): Promise<any> {
    const URL = 'MONGO_URL' + (process.env.IS_PRODUCTION || '')
    console.log('[...] Connect string mongo: ' + URL)
    return mongoose
        .connect(process.env[URL]!)
        .then(() => console.log('[COMPLETED] Successfully connect!'))
        .catch((e) => {
            console.log(e)
            throw '[FAILED] Failed to connect'
        })
}

export default { connect: main }
