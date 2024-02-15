import mongoose from 'mongoose'

async function main(): Promise<any> {
    return mongoose
        .connect(process.env.MONGO_URL!)
        .then(() => console.log('[COMPLETED] Successfully connect!'))
        .catch((e) => {
            console.log(e)
            throw '[FAILED] Failed to connect'
        })
}

export default { connect: main }
