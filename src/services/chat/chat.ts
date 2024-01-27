import mongoose from 'mongoose'
import { MessageModel, UserModel } from '../../app/models'

function createTypeMessage(typeMessage: Record<string, string>, id: string) {
    return typeMessage[id] || 'private'
}

class Chat {
    public socket: any
    public io: any
    public _id: any
    public name: any
    public typeMessage: Record<string, string>
    constructor(socket: any, io: any) {
        this.socket = socket
        this.io = io
        this._id = this.socket.handshake.idPlayer
        this.name = this.socket.handshake.namePlayer
        console.log('socket: ', this.socket.handshake.idPlayer)
        this.typeMessage = {
            '': 'public',
        }
    }

    // on: chat/send | emit: chat/receiving
    async sendMessage(
        { receiverId, message }: { receiverId: string; message: string },
        callback: any,
    ) {
        // receiverId = '' | [id]
        if (!message || message.trim().length === 0) return
        try {
            // type: public | room | private
            const idRoom = this.socket.handshake.idRoom
            this.typeMessage[idRoom] = 'room'
            const type = createTypeMessage(this.typeMessage, receiverId)
            const value = message.trim()
            const from = new mongoose.Types.ObjectId(this._id)
            const objMessage: any = { type, value, from }
            let receiverSocketId = ''
            // to room
            if (type === this.typeMessage[idRoom]) {
                objMessage.to = idRoom
                receiverSocketId = idRoom
            }
            // to player
            if (type !== this.typeMessage[idRoom] && type !== this.typeMessage['']) {
                objMessage.to = receiverId
                const targetPlayer: any = await UserModel.findById(receiverId).lean()
                console.log(targetPlayer.socketId)
                receiverSocketId = targetPlayer.socketId
            }
            // default: to public
            const newMessage = new MessageModel(objMessage)

            // await newMessage.save()

            const resMessage = {
                sender: { _id: this._id, name: this.name },
                receiver: { _id: receiverId },
                message: newMessage.value,
            }
            console.log('receivedId: ', receiverId, ', Type: ', type, objMessage)
            if (type !== this.typeMessage[idRoom] && type !== this.typeMessage['']) {
                // if send to player
                console.log('send to player, receiverSocketId: ', receiverSocketId)
                this.socket.emit('chat/receiving', resMessage)
            }
            // send to public
            if (type === this.typeMessage['']) return this.io.emit('chat/receiving', resMessage)
            // send to room | receiver
            console.log('send other player')
            return this.io.to(receiverSocketId).emit('chat/receiving', resMessage)
        } catch (error) {
            console.log(error)
            callback({
                status: 500,
            })
        }
    }

    /*
    // testMessage(data) {
    //     console.log(data)
    //     cardController
    //         .createListCards('123', [
    //             {
    //                 x: 20.864100251988702,
    //                 y: 796.8349917104338,
    //                 width: 293.2397057009352,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40405',
    //             },
    //             {
    //                 x: 32.146529849970065,
    //                 y: 882.4726356433279,
    //                 width: 377.997433782092,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ec',
    //             },
    //             {
    //                 x: 38.30563047338404,
    //                 y: 1606.374863249674,
    //                 width: 309.0520275481584,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40400',
    //             },
    //             {
    //                 x: 69.64836700496465,
    //                 y: 582.7504775364962,
    //                 width: 362.93543835054214,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40401',
    //             },
    //             {
    //                 x: 85.6897353418818,
    //                 y: 1593.60717617207,
    //                 width: 356.001848887186,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e6',
    //             },
    //             {
    //                 x: 108.02499513910178,
    //                 y: 2933.704439919664,
    //                 width: 348.0983096796349,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403da',
    //             },
    //             {
    //                 x: 114.3668753773864,
    //                 y: 630.7687700026247,
    //                 width: 389.0075229359667,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e3',
    //             },
    //             {
    //                 x: 142.70950115973878,
    //                 y: 2026.2585757574475,
    //                 width: 273.25064729746146,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40409',
    //             },
    //             {
    //                 x: 170.52135735368506,
    //                 y: 1157.9041501130532,
    //                 width: 360.9125747971976,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e9',
    //             },
    //             {
    //                 x: 223.57112698152653,
    //                 y: 1032.749288804198,
    //                 width: 304.67931706018453,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403fc',
    //             },
    //             {
    //                 x: 253.359040052833,
    //                 y: 2283.2408994106536,
    //                 width: 345.2773398641257,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e8',
    //             },
    //             {
    //                 x: 264.4790127189869,
    //                 y: 371.7807626981066,
    //                 width: 403.8714470901443,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f2',
    //             },
    //             {
    //                 x: 269.18070657210546,
    //                 y: 1581.3432208576423,
    //                 width: 282.85585895036843,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ed',
    //             },
    //             {
    //                 x: 313.151575522744,
    //                 y: 1589.7090569043917,
    //                 width: 425.64012407772617,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403d9',
    //             },
    //             {
    //                 x: 313.2007489763568,
    //                 y: 2323.4304259112814,
    //                 width: 287.8714428702948,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f9',
    //             },
    //             {
    //                 x: 314.8611689504514,
    //                 y: 2271.802132884316,
    //                 width: 325.17275706088753,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e1',
    //             },
    //             {
    //                 x: 331.5530284162518,
    //                 y: 2001.2854829488706,
    //                 width: 422.56917080985437,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40407',
    //             },
    //             {
    //                 x: 346.3798553321076,
    //                 y: 1252.919033143089,
    //                 width: 321.9651452634259,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403fa',
    //             },
    //             {
    //                 x: 351.78981226374077,
    //                 y: 2842.3065724982534,
    //                 width: 434.3802264150568,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f3',
    //             },
    //             {
    //                 x: 388.7338606165441,
    //                 y: 646.3782062129188,
    //                 width: 442.0461093218784,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403fe',
    //             },
    //             {
    //                 x: 389.8597921748344,
    //                 y: 353.4800108112905,
    //                 width: 338.4026877492606,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e0',
    //             },
    //             {
    //                 x: 392.99429336613105,
    //                 y: 949.5994946561497,
    //                 width: 322.56739197549973,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f0',
    //             },
    //             {
    //                 x: 397.46701547605903,
    //                 y: 2380.6154281607182,
    //                 width: 362.5977475177504,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f8',
    //             },
    //             {
    //                 x: 420.2263854133936,
    //                 y: 1294.9814158235986,
    //                 width: 155.04043204667042,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403df',
    //             },
    //             {
    //                 x: 425.3930221736482,
    //                 y: 573.2484611743159,
    //                 width: 295.645713983424,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f5',
    //             },
    //             {
    //                 x: 435.65142691191295,
    //                 y: 2091.411711893028,
    //                 width: 436.74266620476044,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f1',
    //             },
    //             {
    //                 x: 452.074449502774,
    //                 y: 2567.32018022718,
    //                 width: 490.8024023709835,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f7',
    //             },
    //             {
    //                 x: 457.7631225534885,
    //                 y: 2523.3750860377777,
    //                 width: 262.06784574747803,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e7',
    //             },
    //             {
    //                 x: 496.4921692237422,
    //                 y: 1861.6170788944946,
    //                 width: 449.0498957140569,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403fd',
    //             },
    //             {
    //                 x: 529.9038455292908,
    //                 y: 2803.9415722399053,
    //                 width: 242.06090755140198,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ff',
    //             },
    //             {
    //                 x: 547.1447533958992,
    //                 y: 3016.554948531761,
    //                 width: 219.56326612513692,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ee',
    //             },
    //             {
    //                 x: 559.6239337653819,
    //                 y: 972.7515478889699,
    //                 width: 116.11734342247732,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403de',
    //             },
    //             {
    //                 x: 564.2091676259495,
    //                 y: 1048.316176614449,
    //                 width: 174.81948168952817,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f6',
    //             },
    //             {
    //                 x: 567.4700478160179,
    //                 y: 2315.8801672309028,
    //                 width: 279.281666651096,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ef',
    //             },
    //             {
    //                 x: 585.5170650467353,
    //                 y: 514.9719480943346,
    //                 width: 335.521383483488,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e2',
    //             },
    //             {
    //                 x: 603.2334925962842,
    //                 y: 1205.5429871486044,
    //                 width: 228.05773655612356,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403fb',
    //             },
    //             {
    //                 x: 622.5731816544329,
    //                 y: 1938.863541886761,
    //                 width: 352.95991336502715,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403dd',
    //             },
    //             {
    //                 x: 628.0422689180893,
    //                 y: 2710.1024542653927,
    //                 width: 337.2405371478267,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e4',
    //             },
    //             {
    //                 x: 643.9073047240046,
    //                 y: 2408.991335003706,
    //                 width: 183.14132584958438,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40408',
    //             },
    //             {
    //                 x: 655.5130617348921,
    //                 y: 2235.6497937131667,
    //                 width: 103.43814747873301,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40406',
    //             },
    //             {
    //                 x: 657.3428028439381,
    //                 y: 1703.6406584450367,
    //                 width: 121.40900865658146,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403ea',
    //             },
    //             {
    //                 x: 680.2044258128274,
    //                 y: 2520.3754817868903,
    //                 width: 368.50680236947954,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40403',
    //             },
    //             {
    //                 x: 683.1140006540488,
    //                 y: 1365.039147522112,
    //                 width: 433.212049914472,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403db',
    //             },
    //             {
    //                 x: 689.8911654325373,
    //                 y: 1837.383542596282,
    //                 width: 376.8091108922861,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403e5',
    //             },
    //             {
    //                 x: 690.3838316498344,
    //                 y: 2281.2741351992045,
    //                 width: 263.08266589192,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40402',
    //             },
    //             {
    //                 x: 780.0809498522618,
    //                 y: 3254.225490348762,
    //                 width: 125.52911868888499,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e40404',
    //             },
    //             {
    //                 x: 818.4276835319936,
    //                 y: 3009.3238116743264,
    //                 width: 288.18324605478426,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403eb',
    //             },
    //             {
    //                 x: 851.5219267611408,
    //                 y: 2388.211816642428,
    //                 width: 180.08054120936202,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403dc',
    //             },
    //             {
    //                 x: 869.1497659918077,
    //                 y: 1282.5292800179486,
    //                 width: 433.72799930267877,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e403f4',
    //             },
    //             {
    //                 x: 883.1918037974626,
    //                 y: 334.95402028804097,
    //                 width: 299.35668266889286,
    //                 height: 20,
    //                 img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
    //                 _id: '6528fb7d960eecd821e4040a',
    //             },
    //         ])
    //         .then((result) => {
    //             console.log('result: ', result)
    //         })
    //         .catch((error) => console.log(error))
    // }*/
}

export default Chat
