const math = require('mathjs')
const config = require('../../../gameConfig.json')
const StickEventRes = require('./stick..event.res')
const CONSTANT_STICK = require('./CONSTANT')
const CollisionCardRes = require('./collisionCard.res')

class Stick {
    constructor(socket, io) {
        this.socket = socket
        this.io = io
        this.EVENT = 'stick-keyboard-event'
        this.EVENT_COLLISION_CARD = 'stick/card/pick-up'
        this._id = this.socket.handshake.idPlayer
        this.vx = 4
        this.eventsState = { ...CONSTANT_STICK }
    }

    // #region get/set
    getId() {
        return this._id
    }

    setId(id) {
        this._id = id
    }

    resetLocation(location) {
        location.vx = 0
        location.vy = 0
    }

    updateLocation(location) {
        location.x = location.x + location.vx
        location.y = location.y + location.vy
    }
    // #endregion get/set

    stand({ event }) {
        this.setId(this.getId())
        const location = this.socket.handshake.match.player.stairGame
        this.socket.handshake.match.eventStateSpecial = this.eventsState.stand
        this.resetLocation(location)
        this.updateLocation(location)

        const mainShape = createShapeStick(
            location.x,
            location.y,
            config.stick.w * config.stick.scale,
            config.stick.h * config.stick.scale,
        )
        const shapesStair = this.socket.handshake.match.stairs.map((stair) =>
            createShapeStair(stair.x, stair.y, stair.width, stair.height),
        )
        const nearest = findNearest(mainShape, shapesStair)
        const standingPlace = Math.min(config.stairGame.height, nearest.bottomNearest[0].y)
        if (standingPlace > location.y) {
            this.socket.handshake.match.eventStateSpecial = this.eventsState.freeFall

            const distanceToStandingPlace = standingPlace - location.y
            const fall = freeFall(location, distanceToStandingPlace)
            // console.log(fall, distanceToStandingPlace)
            this.socket.handshake.match.endEventTime = Math.abs(new Date() + fall.time * 1000)
            location.y = fall.location.y
        }

        // console.log(mainShape, nearest)
        console.log('stand: ', location)
        this.io
            .to(this.socket.handshake.idRoom)
            .emit(this.EVENT, new StickEventRes(this._id, event, location.x, location.y))
        return
    }
    left({ event }) {
        this.setId(this.getId())
        // console.log(this.getId())
        const location = this.socket.handshake.match.player.stairGame

        const mainShape = createShapeStick(
            location.x,
            location.y,
            config.stick.w * config.stick.scale,
            config.stick.h * config.stick.scale,
        )
        const stairShapes = this.socket.handshake.match.stairs.map((stair) =>
            createShapeStair(stair.x, stair.y, stair.width, stair.height),
        )
        const cardShapes = this.socket.handshake.match.cards.map((card) =>
            createShapeCard(
                JSON.parse(card.x),
                JSON.parse(card.y),
                config.card.width,
                config.card.height,
            ),
        )

        const nearest = findNearest(mainShape, stairShapes)
        const nearestCards = findNearest(mainShape, cardShapes)

        const distance = mainShape[0].x - nearest.leftNearest[1].x
        // console.log(distance)
        if (!Number.isFinite(nearest.leftNearest[1].x) || distance > 0) {
            location.vx = -Math.min(this.vx, distance)
            this.updateLocation(location)
        }
        // #region check collision with card position left when stick move
        const numOfCardsPickUp = this.socket.handshake.match.cards.reduce((total, card) => {
            // console.log(card.owner, this._id, card.isEnable)
            if (card.owner === this._id && card.isEnable) {
                total += 1
            }
            return total
        }, 0)
        // console.log('Num of card pick up: ', numOfCardsPickUp)
        const distanceWithCard = mainShape[0].x - nearestCards.leftNearest[1].x
        // console.log('\ndistanceWithCard: ', distanceWithCard, ', location: ', location.vx, '\n')
        if (
            Number.isFinite(distanceWithCard) &&
            distanceWithCard <= Math.abs(location.vx) &&
            numOfCardsPickUp < 5
        ) {
            // console.log('\n\nCollision!\n\n')
            for (const card of this.socket.handshake.match.cards) {
                if (JSON.parse(card.x) === nearestCards.leftNearest[3].x && !card.owner) {
                    // console.log('\n\nHave card\n\n')
                    card.owner = this._id
                    // sendEvent
                    this.io
                        .to(this.socket.handshake.idRoom)
                        .emit(
                            this.EVENT_COLLISION_CARD,
                            new CollisionCardRes(0, this._id, card._id),
                        )
                }
            }
        }
        // #endregion check collision with card position left when stick move

        // #region check stick free fall
        const standingPlace = Math.min(config.stairGame.height, nearest.bottomNearest[0].y)
        // console.log(this.socket.handshake.match.cards, nearestCards)
        if (standingPlace > location.y) {
            // console.log('Fall')
            // #region check, do stick have collision with card position bottom of stick
            const numOfCardsPickUp = this.socket.handshake.match.cards.reduce((total, card) => {
                if (card.owner === this._id && !card.isEnable) {
                    total += 1
                }
                return total
            }, 0)
            const cardBottomCollision = nearestCards.bottomNearest[0].y
            // console.log(
            //     nearestCards.bottomNearest,
            //     numOfCardsPickUp,
            //     cardBottomCollision,
            //     location.y,
            // )
            if (
                Number.isFinite(cardBottomCollision) &&
                numOfCardsPickUp < 5 &&
                cardBottomCollision >= location.y
            ) {
                const distanceWithBottomCard = cardBottomCollision - location.y
                const cardPickedUp = this.socket.handshake.match.cards.find(
                    (card) =>
                        JSON.parse(card.x) === nearestCards.bottomNearest[3].x &&
                        JSON.parse(card.y) === nearestCards.bottomNearest[3].y,
                )
                // console.log(
                //     'Pick up: ',
                //     cardPickedUp,
                //     cardBottomCollision,
                //     location.y,
                //     distanceWithBottomCard,
                // )
                if (cardPickedUp && !cardPickedUp.owner) {
                    const fall = freeFall(location, distanceWithBottomCard)
                    // computed collision's time
                    const timeMilliSeconds = fall.time * 1000
                    // console.log(
                    //     '\nTime collision with card: ',
                    //     timeMilliSeconds,
                    //     ', distance: ',
                    //     distanceWithBottomCard,
                    //     ', local: ',
                    //     location,
                    // )
                    cardPickedUp.timeOut = setTimeout(
                        timeOutUpdateCard.bind(this),
                        timeMilliSeconds,
                        [this._id, cardPickedUp],
                    )
                }
            }
            // #endregion check, do stick have collision with card position bottom of stick

            // #region handle fall
            this.socket.handshake.match.eventStateSpecial = this.eventsState.freeFall

            const distanceToStandingPlace = standingPlace - location.y
            const fall = freeFall(location, distanceToStandingPlace)
            // console.log(fall, distanceToStandingPlace)
            const timeMilliSeconds = fall.time * 1000
            this.socket.handshake.match.endEventTime = Math.abs(new Date() + timeMilliSeconds)
            // #endregion handle fall
            location.y = fall.location.y
        } else {
            this.socket.handshake.match.eventStateSpecial = this.eventsState.stand
        }
        // #endregion check stick free fall

        // console.log(mainShape, nearest)
        console.log('left: ', location)
        const specialEvent = this.socket.handshake.match.eventStateSpecial
        this.io
            .to(this.socket.handshake.idRoom)
            .emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y, specialEvent),
            )
    }
    right({ event }) {
        this.setId(this.getId())
        const location = this.socket.handshake.match.player.stairGame

        const mainShape = createShapeStick(
            location.x,
            location.y,
            config.stick.w * config.stick.scale,
            config.stick.h * config.stick.scale,
        )
        const stairShapes = this.socket.handshake.match.stairs.map((stair) =>
            createShapeStair(stair.x, stair.y, stair.width, stair.height),
        )
        const nearest = findNearest(mainShape, stairShapes)
        const cardShapes = this.socket.handshake.match.cards.map((card) =>
            createShapeCard(
                JSON.parse(card.x),
                JSON.parse(card.y),
                config.card.width,
                config.card.height,
            ),
        )
        const nearestCards = findNearest(mainShape, cardShapes)
        const distance = nearest.rightNearest[0].x - mainShape[1].x

        if (!Number.isFinite(nearest.rightNearest[1].x) || distance > 0) {
            location.vx = Math.min(this.vx, distance)
            this.updateLocation(location)
        }

        // #region check collision with card position right when stick move
        const numOfCardsPickUp = this.socket.handshake.match.cards.reduce((total, card) => {
            // console.log(card.owner, this._id, card.isEnable)
            if (card.owner === this._id && card.isEnable) {
                total += 1
            }
            return total
        }, 0)
        // console.log('Num of card pick up: ', numOfCardsPickUp)
        const distanceWithCard = nearestCards.rightNearest[0].x - mainShape[1].x
        // console.log('\nMx: ', mainShape[1].x, ', Nx: ', nearestCards.rightNearest[0].x, 'distanceWithCard: ', distanceWithCard, ', location: ', location.vx, '\n',)
        if (
            Number.isFinite(distanceWithCard) &&
            distanceWithCard <= Math.abs(location.vx) &&
            numOfCardsPickUp < 5
        ) {
            // console.log('\n\nCollision!\n\n')
            for (const card of this.socket.handshake.match.cards) {
                if (JSON.parse(card.x) === nearestCards.rightNearest[3].x && !card.owner) {
                    // console.log('\n\nHave card\n\n')
                    card.owner = this._id
                    // sendEvent
                    this.io
                        .to(this.socket.handshake.idRoom)
                        .emit(
                            this.EVENT_COLLISION_CARD,
                            new CollisionCardRes(0, this._id, card._id),
                        )
                }
            }
        }
        // #endregion check collision with card position right when stick move

        // #region check stick free fall
        const standingPlace = Math.min(config.stairGame.height, nearest.bottomNearest[0].y)
        if (standingPlace > location.y) {
            // console.log(this.socket.handshake.match.cards, nearestCards)
            // console.log('Fall')
            // #region check, do stick have collision with card position bottom of stick
            const numOfCardsPickUp = this.socket.handshake.match.cards.reduce((total, card) => {
                if (card.owner === this._id && !card.isEnable) {
                    total += 1
                }
                return total
            }, 0)
            const cardBottomCollision = nearestCards.bottomNearest[0].y
            // console.log(
            //     nearestCards.bottomNearest,
            //     numOfCardsPickUp,
            //     cardBottomCollision,
            //     location.y,
            // )
            if (
                Number.isFinite(cardBottomCollision) &&
                numOfCardsPickUp < 5 &&
                cardBottomCollision >= location.y
            ) {
                const distanceWithBottomCard = cardBottomCollision - location.y
                const cardPickedUp = this.socket.handshake.match.cards.find(
                    (card) =>
                        JSON.parse(card.x) === nearestCards.bottomNearest[3].x &&
                        JSON.parse(card.y) === nearestCards.bottomNearest[3].y,
                )
                // console.log(
                //     'Pick up: ',
                //     cardPickedUp,
                //     cardBottomCollision,
                //     location.y,
                //     distanceWithBottomCard,
                // )
                if (cardPickedUp && !cardPickedUp.owner) {
                    const fall = freeFall(location, distanceWithBottomCard)
                    // computed collision's time
                    const timeMilliSeconds = fall.time * 1000
                    // console.log(
                    //     '\nTime collision with card: ',
                    //     timeMilliSeconds,
                    //     ', distance: ',
                    //     distanceWithBottomCard,
                    //     ', local: ',
                    //     location,
                    // )
                    cardPickedUp.timeOut = setTimeout(
                        timeOutUpdateCard.bind(this),
                        timeMilliSeconds,
                        [this._id, cardPickedUp],
                    )
                }
            }
            // #endregion check, do stick have collision with card position bottom of stick

            // #region handle fall
            this.socket.handshake.match.eventStateSpecial = this.eventsState.freeFall

            const distanceToStandingPlace = standingPlace - location.y
            const fall = freeFall(location, distanceToStandingPlace)
            // console.log(fall, distanceToStandingPlace)
            this.socket.handshake.match.endEventTime = Math.abs(new Date() + fall.time * 1000)
            // #endregion handle fall
            location.y = fall.location.y
        } else {
            this.socket.handshake.match.eventStateSpecial = this.eventsState.stand
        }
        // #endregion check stick free fall

        // console.log(mainShape, nearest)
        console.log('right: ', location)

        const specialEvent = this.socket.handshake.match.eventStateSpecial
        this.io
            .to(this.socket.handshake.idRoom)
            .emit(
                this.EVENT,
                new StickEventRes(this._id, event, location.x, location.y, specialEvent),
            )
    }
    jumpLeft({ event }) {
        // console.log(
        //     this.socket.handshake.match.eventStateSpecial,
        //     this.eventsState.freeFall,
        //     this.socket.handshake.match.eventStateSpecial === this.eventsState.freeFall,
        // )
        if (this.socket.handshake.match.eventStateSpecial === this.eventsState.freeFall) return
        this.setId(this.getId())
        const location = this.socket.handshake.match.player.stairGame

        location.vx = -4
        location.vy = -10
        this.updateLocation(location)

        // const mainShape = createShapeStick(
        //     location.x,
        //     location.y,
        //     config.stick.w * config.stick.scale,
        //     config.stick.h * config.stick.scale,
        // )
        // const shapesStair = this.socket.handshake.match.stairs.map((stair) =>
        //     createShapeStair(stair.x, stair.y, stair.width, stair.height),
        // )
        // const nearest = findNearest(mainShape, shapesStair)
        // const cardsShape = this.socket.handshake.match.cards.map((card) =>
        //     createShapeCard(card.x, card.y, card.width, card.height),
        // )

        // console.log(mainShape, nearest)
        console.log('jump-left: ', location)
        this.io
            .to(this.socket.handshake.idRoom)
            .emit(this.EVENT, new StickEventRes(this._id, event, location.x, location.y))
    }
    jumpRight({ event }) {
        if (this.socket.handshake.match.eventStateSpecial === this.eventsState.freeFall) return
        this.setId(this.getId())
        const location = this.socket.handshake.match.player.stairGame
        location.vx = 4
        location.vy = -10
        this.updateLocation(location)

        // const mainShape = createShapeStick(
        //     location.x,
        //     location.y,
        //     config.stick.w * config.stick.scale,
        //     config.stick.h * config.stick.scale,
        // )
        // const shapesStair = this.socket.handshake.match.stairs.map((stair) =>
        //     createShapeStair(stair.x, stair.y, stair.width, stair.height),
        // )
        // const nearest = findNearest(mainShape, shapesStair)
        // const cardsShape = this.socket.handshake.match.cards.map((card) =>
        //     createShapeCard(card.x, card.y, card.width, card.height),
        // )

        // console.log(mainShape, nearest)
        console.log('jump-right: ', location)
        this.io
            .to(this.socket.handshake.idRoom)
            .emit(this.EVENT, new StickEventRes(this._id, event, location.x, location.y))
    }
}

function timeOutUpdateCard([_id, card]) {
    console.log('Arguments: ', card._id)
    let cardFound = null
    const numOfCardsPickUp = this.socket.handshake.match.cards.reduce((total, curCard) => {
        // console.log(card.owner, _id, card.isEnable)
        if (card._id === curCard._id) cardFound = card
        if (curCard.owner === _id && curCard.isEnable) {
            total += 1
        }
        return total
    }, 0)
    // console.log(numOfCardsPickUp)
    if (numOfCardsPickUp < 5 && cardFound) {
        const location = this.socket.handshake.match.player.stairGame
        const shapeStick = createShapeStick(
            location.x,
            location.y,
            config.stick.w * config.stick.scale,
            config.stick.h * config.stick.scale,
        )
        const shapeCard = createShapeCard(
            JSON.parse(cardFound.x),
            JSON.parse(cardFound.y),
            config.card.width,
            config.card.height,
        )
        const checkCollisionX =
            (shapeStick[0].x >= shapeCard[0].x && shapeStick[0].x <= shapeCard[1].x) ||
            (shapeStick[1].x >= shapeCard[0].x && shapeStick[1].x <= shapeCard[1].x) ||
            (shapeStick[0].x <= shapeCard[0].x && shapeStick[1].x >= shapeCard[1].x)
        const checkCollisionY =
            (shapeStick[0].y >= shapeCard[0].y && shapeStick[0].y <= shapeCard[3].y) ||
            (shapeStick[3].y >= shapeStick[0].y && shapeStick[3].y <= shapeCard[3].y) ||
            (shapeStick[0].y <= shapeCard[0].y && shapeStick[3].y >= shapeCard[3].y)
        if (checkCollisionX && checkCollisionY && !cardFound.owner) {
            // console.log('\n\nHave card\n\n')
            cardFound.owner = _id
            // sendEvent
            this.io
                .to(this.socket.handshake.idRoom)
                .emit(this.EVENT_COLLISION_CARD, new CollisionCardRes(0, _id, cardFound._id))
        }
    }
}

function freeFall({ x, y }, kDistance) {
    // s = v0t + 1/2g*t^2, with g = 10 m/s^2, v0 = 0
    // => s = 1/2 * 10 * t^2 (m), set 1m = 1pixel
    // => t = sqrt(2 * s / 10 ) = sqrt(2 * kDistance / 10)
    // => t = 0 <=> kDistance = 0 => no distance => can move
    return {
        // this free fall
        // time: Math.sqrt((2 * kDistance) / 10),
        // location: {
        //     x,
        //     y: y + kDistance,
        // },
        time: kDistance / 616.23, // v = 616.23 pixel/s
        location: {
            x,
            y: y + kDistance,
        },
    }
}

function findNearest(mainShape, otherShapes) {
    const baseMinShape = [
        { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
        { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
        { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
        { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
    ]
    const baseMaxShape = [
        { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY },
        { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY },
        { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY },
        { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY },
    ]
    let topNearest = [...baseMinShape]
    let rightNearest = [...baseMaxShape]
    let bottomNearest = [...baseMaxShape]
    let leftNearest = [...baseMinShape]
    for (const shape of otherShapes) {
        // #region main check
        const checkXTop =
            (mainShape[0].x >= shape[0].x && mainShape[0].x <= shape[1].x) ||
            (mainShape[1].x >= shape[0].x && mainShape[1].x <= shape[1].x) ||
            (mainShape[0].x >= shape[0].x && mainShape[1].x <= shape[1].x)
        const checkXBottom =
            (mainShape[0].x >= shape[0].x && mainShape[0].x <= shape[1].x) ||
            (mainShape[1].x >= shape[0].x && mainShape[1].x <= shape[1].x) ||
            (mainShape[0].x >= shape[0].x && mainShape[1].x <= shape[1].x)
        const checkYRight =
            (mainShape[0].y >= shape[0].y && mainShape[0].y <= shape[3].y) ||
            (mainShape[3].y >= shape[0].y && mainShape[3].y <= shape[3].y) ||
            (mainShape[0].y <= shape[0].y && mainShape[3].y >= shape[3].y)
        const checkYLeft =
            (mainShape[0].y >= shape[0].y && mainShape[0].y <= shape[3].y) ||
            (mainShape[3].y >= shape[0].y && mainShape[3].y <= shape[3].y) ||
            (mainShape[0].y <= shape[0].y && mainShape[3].y >= shape[3].y)
        // #endregion main check
        // top      |shape| <= |main|           and Max(|shape1|, |shape2|)
        // y -----------------------------------------------------------------------------
        if (checkXTop && mainShape[0].y >= shape[3].y)
            topNearest = maxFor(topNearest, shape, 0, 0, 'y')

        // bottom              |main| <= |shape| and Min(|shape1|,|shape2|)
        // y -----------------------------------------------------------------------------
        if (checkXBottom && mainShape[2].y <= shape[0].y)
            bottomNearest = minFor(bottomNearest, shape, 0, 0, 'y')

        // right               |main| <= |shape| and Min(|shape1|,|shape2|)
        // x -----------------------------------------------------------------------------
        if (checkYRight && mainShape[1].x <= shape[0].x)
            rightNearest = minFor(rightNearest, shape, 0, 0, 'x')

        // left     |shape| <= |main|           and Max(|shape1|, |shape2|)
        // x -----------------------------------------------------------------------------
        if (checkYLeft && mainShape[0].x >= shape[1].x)
            leftNearest = maxFor(leftNearest, shape, 0, 0, 'x')
    }

    function minFor(curShape, newShape, s1Point, s2Point, axis) {
        return curShape[s1Point][axis] > newShape[s2Point][axis] ? [...newShape] : curShape
    }

    function maxFor(curShape, newShape, s1Point, s2Point, axis) {
        return curShape[s1Point][axis] > newShape[s2Point][axis] ? curShape : [...newShape]
    }

    return {
        topNearest,
        rightNearest,
        bottomNearest,
        leftNearest,
    }
}
// console.log('\n\n\n', findIntersectionXLevel2([[1, 0, -1], [0]], [[0, 1, -1], [1]]), '\n\n\n')

// góc phải dưới: {x1, y1} (trái trên), {x2, y2} (phải trên),
// {x3, y3} (phải dưới), {x4, y4} (trái dưới)
function createShapeStick(x3, y3, w, h) {
    return [
        { x: x3 - w, y: y3 - h },
        { x: x3, y: y3 - h },
        { x: x3, y: y3 },
        { x: x3 - w, y: y3 },
    ]
}
function createShapeStair(x1, y1, w, h) {
    return [
        { x: x1, y: y1 },
        { x: x1 + w, y: y1 },
        { x: x1 + w, y: y1 + h },
        { x: x1, y: y1 + h },
    ]
}
function createShapeCard(x4, y4, w, h) {
    return [
        { x: x4, y: y4 - h },
        { x: x4 + w, y: y4 - h },
        { x: x4 + w, y: y4 },
        { x: x4, y: y4 },
    ]
}

module.exports = Stick
