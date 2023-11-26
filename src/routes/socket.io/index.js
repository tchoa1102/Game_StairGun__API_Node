const site = require('./site')
const chat = require('./chat')
const stick = require('./stick')
const gunGame = require('./gun.game/index')
const room = require('./site/room')
const { RoomModel, UserModel } = require('../../app/models')
const RoomAddRes = require('./site/room/room.add.res')

const config = require('../../gameConfig.json')

const playersOnMatch = [
    {
        _id: '103339144746729860355111',
        AGI: 5,
        ATK: 5,
        DEF: 5,
        HP: 100,
        LUK: 5,
        STA: 100,
        clientId: 'WuT8z1I5u_IDnHzGAAAA',
        level: 1,
        name: 'Kyuseishu Shu',
        picture:
            'https://lh3.googleusercontent.com/a/ACg8ocIHww5amL1M1RYEUP_UzHlX35DUZH2spv8znVITPOqB7w=s96-c',
        skills: [],
        socketId: 'fHQpRKS5mw4xRyMZAAAB',
        uid: 'FaBAeAH0GsQq0J83tjMZMwKTqbF2',
        updatedAt: '2023-10-20T06:14:18.752Z',
    },
    {
        _id: '115421543287322673156111',
        AGI: 5,
        ATK: 5,
        DEF: 5,
        HP: 100,
        LUK: 5,
        STA: 100,
        bag: [],
        character: '000000000000000000000000',
        clientId: 'WuT8z1I5u_IDnHzGAAAA',
        email: 'chihoa1593@gmail.com',
        level: 1,
        looks: {
            face: 'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1/StairGunGame/equipment/face/face.default.json',
            body: 'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1/StairGunGame/equipment/body/body.default.json',
            hand: 'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1…tairGunGame/equipment/body/body.default.hand.json',
            foot: 'https://res.cloudinary.com/dyhfvkzag/raw/upload/v1/StairGunGame/equipment/foot/foot.default.json',
        },
        name: 'Kyuseishu Shu',
        picture:
            'https://lh3.googleusercontent.com/a/ACg8ocIHww5amL1M1RYEUP_UzHlX35DUZH2spv8znVITPOqB7w=s96-c',
        skills: [],
        socketId: 'fHQpRKS5mw4xRyMZAAAB',
        uid: 'FaBAeAH0GsQq0J83tjMZMwKTqbF2',
        updatedAt: '2023-10-20T06:14:18.752Z',
    },
]

const playerData = {
    match: '6528fb7d960eecd821e4040d',
    target: { _id: '115421543287322673156111' },
    position: 3,
    mainGame: {
        bottomLeft: { x: 190.5, y: 400 },
        characterGradient: 90,
        AGI: 5,
        ATK: 5,
        DEF: 5,
        HP: 100,
        LUK: 5,
        STA: 100,
        skillsUsing: [],
        cardsUsing: [],
        stateEffects: [],
    },
    stairGame: { x: 307.3022282869877, y: config.stairGame.height - 1000, vx: 0, vy: 0 },
}

const playerData2 = {
    match: '6528fb7d960eecd821e4040d',
    target: {
        _id: '103339144746729860355111',
        AGI: 5,
        ATK: 5,
        DEF: 5,
        HP: 100,
        LUK: 5,
        STA: 100,
    },
    position: 0,
    mainGame: {
        bottomLeft: { x: 600, y: -340 },
        characterGradient: 90,
        AGI: 5,
        ATK: 5,
        DEF: 5,
        HP: 100,
        LUK: 5,
        STA: 100,
        skillsUsing: [],
        cardsUsing: [],
        stateEffects: [],
    },
    stairGame: { x: 434.6562286730177, y: config.stairGame.height },
}

// #region config card and stair
const objects = [
    {
        location: {
            x: 100,
            y: -400,
        },
        data: {
            _id: '653938778921bd559f21975f',
            points: [
                {
                    x: 0,
                    y: 54.5,
                },
                {
                    x: 45,
                    y: 22,
                },
                {
                    x: 90.5,
                    y: 0,
                },
                {
                    x: 152.5,
                    y: 0,
                },
                {
                    x: 199.5,
                    y: 15,
                },
                {
                    x: 185.5,
                    y: 97.5,
                },
                {
                    x: 134.5,
                    y: 140,
                },
                {
                    x: 9.5,
                    y: 140,
                },
            ],
            canBeDestroyed: false,
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/gunGame/objects/stone-1.png',
            name: 'stone-1',
        },
    },
    {
        location: {
            x: 600,
            y: -340,
        },
        data: {
            _id: '65393b588921bd559f219760',
            points: [
                {
                    x: 0,
                    y: 8.36,
                },
                {
                    x: 26.28,
                    y: 0,
                },
                {
                    x: 60.77,
                    y: 0,
                },
                {
                    x: 86.09,
                    y: 12.06,
                },
                {
                    x: 111.13,
                    y: 30.36,
                },
                {
                    x: 105.84,
                    y: 78,
                },
                {
                    x: 36.29,
                    y: 78,
                },
                {
                    x: 7.92,
                    y: 54.32,
                },
            ],
            canBeDestroyed: false,
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/gunGame/objects/stone-2.png',
            name: 'stone-2',
        },
    },
    {
        location: {
            x: 70,
            y: -400,
        },
        data: {
            _id: '65386e998921bd559f21975e',
            points: [
                {
                    x: 0,
                    y: 11.94,
                },
                {
                    x: 8.49,
                    y: 9.52,
                },
                {
                    x: 9.93,
                    y: 6.13,
                },
                {
                    x: 11.53,
                    y: 5.32,
                },
                {
                    x: 12.97,
                    y: 5.16,
                },
                {
                    x: 12.05,
                    y: 3.06,
                },
                {
                    x: 13.45,
                    y: 1.13,
                },
                {
                    x: 21.94,
                    y: 1.13,
                },
                {
                    x: 22.74,
                    y: 0,
                },
                {
                    x: 27.54,
                    y: 0.65,
                },
                {
                    x: 28.98,
                    y: 2.1,
                },
                {
                    x: 29.3,
                    y: 0.32,
                },
                {
                    x: 30.91,
                    y: 0.1,
                },
                {
                    x: 32.67,
                    y: 0,
                },
                {
                    x: 32.99,
                    y: 0.05,
                },
                {
                    x: 32.83,
                    y: 3.23,
                },
                {
                    x: 34.91,
                    y: 3.55,
                },
                {
                    x: 36.67,
                    y: 4.35,
                },
                {
                    x: 37.95,
                    y: 5.89,
                },
                {
                    x: 39.23,
                    y: 7.42,
                },
                {
                    x: 40.03,
                    y: 9.52,
                },
                {
                    x: 49,
                    y: 10.48,
                },
                {
                    x: 48.2,
                    y: 40.97,
                },
                {
                    x: 29.14,
                    y: 50,
                },
                {
                    x: 1.44,
                    y: 43.55,
                },
                {
                    x: 1.44,
                    y: 21.94,
                },
                {
                    x: 0,
                    y: 21.94,
                },
            ],
            canBeDestroyed: true,
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1698299614/StairGunGame/gunGame/objects/box-size-49x50.png',
            name: 'gift-box',
        },
    },
    {
        location: {
            x: 280,
            y: -380,
        },
        data: {
            _id: '65386e998921bd559f21975e',
            points: [
                {
                    x: 0,
                    y: 11.94,
                },
                {
                    x: 8.49,
                    y: 9.52,
                },
                {
                    x: 9.93,
                    y: 6.13,
                },
                {
                    x: 11.53,
                    y: 5.32,
                },
                {
                    x: 12.97,
                    y: 5.16,
                },
                {
                    x: 12.05,
                    y: 3.06,
                },
                {
                    x: 13.45,
                    y: 1.13,
                },
                {
                    x: 21.94,
                    y: 1.13,
                },
                {
                    x: 22.74,
                    y: 0,
                },
                {
                    x: 27.54,
                    y: 0.65,
                },
                {
                    x: 28.98,
                    y: 2.1,
                },
                {
                    x: 29.3,
                    y: 0.32,
                },
                {
                    x: 30.91,
                    y: 0.1,
                },
                {
                    x: 32.67,
                    y: 0,
                },
                {
                    x: 32.99,
                    y: 0.05,
                },
                {
                    x: 32.83,
                    y: 3.23,
                },
                {
                    x: 34.91,
                    y: 3.55,
                },
                {
                    x: 36.67,
                    y: 4.35,
                },
                {
                    x: 37.95,
                    y: 5.89,
                },
                {
                    x: 39.23,
                    y: 7.42,
                },
                {
                    x: 40.03,
                    y: 9.52,
                },
                {
                    x: 49,
                    y: 10.48,
                },
                {
                    x: 48.2,
                    y: 40.97,
                },
                {
                    x: 29.14,
                    y: 50,
                },
                {
                    x: 1.44,
                    y: 43.55,
                },
                {
                    x: 1.44,
                    y: 21.94,
                },
                {
                    x: 0,
                    y: 21.94,
                },
            ],
            canBeDestroyed: true,
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1698299614/StairGunGame/gunGame/objects/box-size-49x50.png',
            name: 'gift-box',
        },
    },
]
const cards = [
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '956.8911654325373',
        y: '1837.383542596282',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87f7',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '692.2091676259495',
        y: '1048.316176614449',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87f8',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '699.5530284162518',
        y: '2001.2854829488706',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87f9',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '495.65142691191295',
        y: '2091.411711893028',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87fa',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '603.7631225534885',
        y: '2523.3750860377777',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87fb',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '661.5130617348921',
        y: '2235.6497937131667',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87fc',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '313.1465298499701',
        y: '882.4726356433279',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87fd',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '935.5219267611408',
        y: '2388.211816642428',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87fe',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '943.4921692237422',
        y: '1861.6170788944946',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb87ff',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '437.02499513910175',
        y: '2933.704439919664',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8800',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '487.2263854133936',
        y: '1294.9814158235986',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8801',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '371.5711269815265',
        y: '1032.749288804198',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8802',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '1036.1497659918077',
        y: '1282.5292800179486',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8803',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '912.074449502774',
        y: '2567.32018022718',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8804',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '383.7095011597388',
        y: '2026.2585757574475',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8805',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '676.5170650467353',
        y: '514.9719480943346',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8806',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '698.4700478160179',
        y: '2315.8801672309028',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8807',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '248.8641002519887',
        y: '796.8349917104338',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8808',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '454.99429336613105',
        y: '949.5994946561497',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8809',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '584.9038455292908',
        y: '2803.9415722399053',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880a',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '799.0422689180893',
        y: '2710.1024542653927',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880b',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '758.3428028439381',
        y: '1703.6406584450367',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880c',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '320.3668753773864',
        y: '630.7687700026247',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880d',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '568.3798553321076',
        y: '1252.919033143089',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880e',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '667.479012718987',
        y: '371.7807626981066',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb880f',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '1042.1918037974626',
        y: '334.95402028804097',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8810',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '90.64836700496465',
        y: '582.7504775364962',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8811',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '524.7338606165441',
        y: '646.3782062129188',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8812',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '733.467015476059',
        y: '2380.6154281607182',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8813',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '322.2007489763568',
        y: '2323.4304259112814',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8814',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '490.359040052833',
        y: '2283.2408994106536',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8815',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '434.151575522744',
        y: '1589.7090569043917',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8816',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '874.0809498522618',
        y: '3254.225490348762',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8817',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '800.2044258128274',
        y: '2520.3754817868903',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8818',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '660.1447533958992',
        y: '3016.554948531761',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb8819',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '200.52135735368506',
        y: '1157.9041501130532',
        isEnable: true,
        owner: null,
        _id: '65316ff94b30d349bdeb881a',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '232.6897353418818',
        y: '1593.60717617207',
        isEnable: true,
        owner: null,
        _id: '65316ffa4b30d349bdeb881b',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '842.1140006540488',
        y: '1365.039147522112',
        isEnable: true,
        owner: null,
        _id: '65316ffa4b30d349bdeb881c',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa293db5f87468210b950',
            name: 'Double damage',
            type: 'x2',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-double-damage.png',
            match: 'CardDoubleDamage',
        },
        x: '474.78981226374077',
        y: '2842.3065724982534',
        isEnable: true,
        owner: null,
        _id: '65316ffa4b30d349bdeb881d',
    },
    {
        timeOut: null,
        data: {
            _id: '652fa2d4db5f87468210b951',
            name: 'Neutralization',
            type: 'neutralization',
            src: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/cards/Card-on-disable.png',
            match: 'CardNeutralization',
        },
        x: '646.6239337653819',
        y: '972.7515478889699',
        isEnable: true,
        owner: null,
        _id: '65316ffa4b30d349bdeb881e',
    },
]

const stairs = [
    {
        x: 20.864100251988702,
        y: 796.8349917104338,
        width: 293.2397057009352,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40405',
    },
    {
        x: 32.146529849970065,
        y: 882.4726356433279,
        width: 377.997433782092,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ec',
    },
    {
        x: 38.30563047338404,
        y: 1606.374863249674,
        width: 309.0520275481584,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40400',
    },
    {
        x: 69.64836700496465,
        y: 582.7504775364962,
        width: 362.93543835054214,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40401',
    },
    {
        x: 85.6897353418818,
        y: 1593.60717617207,
        width: 356.001848887186,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e6',
    },
    {
        x: 108.02499513910178,
        y: 2933.704439919664,
        width: 348.0983096796349,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403da',
    },
    {
        x: 114.3668753773864,
        y: 630.7687700026247,
        width: 389.0075229359667,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e3',
    },
    {
        x: 142.70950115973878,
        y: 2026.2585757574475,
        width: 273.25064729746146,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40409',
    },
    {
        x: 170.52135735368506,
        y: 1157.9041501130532,
        width: 360.9125747971976,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e9',
    },
    {
        x: 223.57112698152653,
        y: 1032.749288804198,
        width: 304.67931706018453,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403fc',
    },
    {
        x: 253.359040052833,
        y: 2283.2408994106536,
        width: 345.2773398641257,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e8',
    },
    {
        x: 264.4790127189869,
        y: 371.7807626981066,
        width: 403.8714470901443,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f2',
    },
    {
        x: 269.18070657210546,
        y: 1581.3432208576423,
        width: 282.85585895036843,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ed',
    },
    {
        x: 313.151575522744,
        y: 1589.7090569043917,
        width: 425.64012407772617,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403d9',
    },
    {
        x: 313.2007489763568,
        y: 2323.4304259112814,
        width: 287.8714428702948,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f9',
    },
    {
        x: 314.8611689504514,
        y: 2271.802132884316,
        width: 325.17275706088753,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e1',
    },
    {
        x: 331.5530284162518,
        y: 2001.2854829488706,
        width: 422.56917080985437,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40407',
    },
    {
        x: 346.3798553321076,
        y: 1252.919033143089,
        width: 321.9651452634259,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403fa',
    },
    {
        x: 351.78981226374077,
        y: 2842.3065724982534,
        width: 434.3802264150568,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f3',
    },
    {
        x: 388.7338606165441,
        y: 646.3782062129188,
        width: 442.0461093218784,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403fe',
    },
    {
        x: 389.8597921748344,
        y: 353.4800108112905,
        width: 338.4026877492606,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e0',
    },
    {
        x: 392.99429336613105,
        y: 949.5994946561497,
        width: 322.56739197549973,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f0',
    },
    {
        x: 397.46701547605903,
        y: 2380.6154281607182,
        width: 362.5977475177504,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f8',
    },
    {
        x: 420.2263854133936,
        y: 1294.9814158235986,
        width: 155.04043204667042,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403df',
    },
    {
        x: 425.3930221736482,
        y: 573.2484611743159,
        width: 295.645713983424,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f5',
    },
    {
        x: 435.65142691191295,
        y: 2091.411711893028,
        width: 436.74266620476044,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f1',
    },
    {
        x: 452.074449502774,
        y: 2567.32018022718,
        width: 490.8024023709835,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f7',
    },
    {
        x: 457.7631225534885,
        y: 2523.3750860377777,
        width: 262.06784574747803,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e7',
    },
    {
        x: 496.4921692237422,
        y: 1861.6170788944946,
        width: 449.0498957140569,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403fd',
    },
    {
        x: 529.9038455292908,
        y: 2803.9415722399053,
        width: 242.06090755140198,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ff',
    },
    {
        x: 547.1447533958992,
        y: 3016.554948531761,
        width: 219.56326612513692,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ee',
    },
    {
        x: 559.6239337653819,
        y: 972.7515478889699,
        width: 116.11734342247732,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403de',
    },
    {
        x: 564.2091676259495,
        y: 1048.316176614449,
        width: 174.81948168952817,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f6',
    },
    {
        x: 567.4700478160179,
        y: 2315.8801672309028,
        width: 279.281666651096,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ef',
    },
    {
        x: 585.5170650467353,
        y: 514.9719480943346,
        width: 335.521383483488,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e2',
    },
    {
        x: 603.2334925962842,
        y: 1205.5429871486044,
        width: 228.05773655612356,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403fb',
    },
    {
        x: 622.5731816544329,
        y: 1938.863541886761,
        width: 352.95991336502715,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403dd',
    },
    {
        x: 628.0422689180893,
        y: 2710.1024542653927,
        width: 337.2405371478267,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e4',
    },
    {
        x: 643.9073047240046,
        y: 2408.991335003706,
        width: 183.14132584958438,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40408',
    },
    {
        x: 655.5130617348921,
        y: 2235.6497937131667,
        width: 103.43814747873301,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40406',
    },
    {
        x: 657.3428028439381,
        y: 1703.6406584450367,
        width: 121.40900865658146,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403ea',
    },
    {
        x: 680.2044258128274,
        y: 2520.3754817868903,
        width: 368.50680236947954,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40403',
    },
    {
        x: 683.1140006540488,
        y: 1365.039147522112,
        width: 433.212049914472,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403db',
    },
    {
        x: 689.8911654325373,
        y: 1837.383542596282,
        width: 376.8091108922861,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403e5',
    },
    {
        x: 690.3838316498344,
        y: 2281.2741351992045,
        width: 263.08266589192,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40402',
    },
    {
        x: 780.0809498522618,
        y: 3254.225490348762,
        width: 125.52911868888499,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e40404',
    },
    {
        x: 818.4276835319936,
        y: 3009.3238116743264,
        width: 288.18324605478426,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403eb',
    },
    {
        x: 851.5219267611408,
        y: 2388.211816642428,
        width: 180.08054120936202,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403dc',
    },
    {
        x: 869.1497659918077,
        y: 1282.5292800179486,
        width: 433.72799930267877,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e403f4',
    },
    {
        x: 883.1918037974626,
        y: 334.95402028804097,
        width: 299.35668266889286,
        height: 20,
        img: 'https://res.cloudinary.com/dyhfvkzag/image/upload/v1/StairGunGame/stairGame/stairs/nptlgilxtpj9apzmmr7h.png',
        _id: '6528fb7d960eecd821e4040a',
    },
]
// #endregion config card and stair

module.exports = function (io) {
    io.on('connection', async function (socket) {
        // #region when first connected
        // console.log(socket)

        // #region test env => can xoa
        socket.handshake.idRoom = '1'
        socket.join(socket.handshake.idRoom)
        socket.handshake.match = {
            stairs: stairs,
            cards: cards,
            timeStart: '2023-10-13T08:10:37.875Z',
            windForce: 1.1,
            players: playersOnMatch,
            player: playerData,
            objects,
            eventStateSpecial: undefined,
            endEventTime: Math.abs(new Date() - new Date(0)),
        }
        // #endregion test env => can xoa

        console.log('idPlayer: ', socket.handshake.idPlayer)
        const dataSendWhenConnection = { clientId: socket.client.id, socketId: socket.id }
        try {
            await UserModel.updateOne(
                { _id: socket.handshake.idPlayer },
                {
                    socketId: dataSendWhenConnection.socketId,
                    clientId: dataSendWhenConnection.clientId,
                },
            )
        } catch (error) {
            console.log("changing player's socket id: ", error)
        }

        socket.emit('connection', dataSendWhenConnection)
        console.log(`A user connected  ${socket.id}, clientID: ${socket.client.id}`)
        // #endregion when first connected

        // when disconnect
        socket.on('disconnect', async function () {
            console.log(
                `A user disconnected, ${socket?.id}, clientID: ${socket?.client?.id}, idPlayer: ${socket.handshake.idPlayer}`,
            )

            await UserModel.updateOne(
                { _id: socket.handshake.idPlayer },
                {
                    socketId: null,
                    clientId: null,
                },
            )

            // go out room
            room.goOut(socket, io)()
        })

        // other
        site(socket, io)
        chat(socket, io)
        stick(socket, io)
        gunGame(socket, io)
    })
}

/**
 * socket.client.socket => idSocket
 * socket.client.conn.id => idSocketClient
 */
