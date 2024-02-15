import mongoose from 'mongoose'
const Schema = mongoose.Schema

/**
 * 
 * echo "# game-tuchan" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/tchoa1593/game-tuchan.git
git push -u origin main
 */

const CardSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    src: { type: String, required: true },
    match: { type: String, required: true },
})

const CardModel = mongoose.model('cards', CardSchema)

CardModel.init().then(() => {
    console.log('Card collection created!')
})

export default CardModel
