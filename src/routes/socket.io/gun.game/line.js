class Line {
    constructor() {
        this.first = null
        this.last = null
    }

    init(first, last) {
        this.first = first
        this.last = last
        return this
    }

    copy(newLine) {
        this.first = newLine.first
        this.last = newLine.last
    }

    findXFromY(y) {
        // console.log('Data received: ', x, ", ", this.first, ', ', this.last)
        return (
            (-(this.last.x - this.first.x) * (y - this.first.y)) / (this.first.y - this.last.y) +
            this.first.x
        )
    }

    findYFromX(x) {
        // console.log('Data received: ', x, ", ", this.first, ', ', this.last)
        return (
            (-(this.first.y - this.last.y) * (x - this.first.x)) / (this.last.x - this.first.x) +
            this.first.y
        )
    }
}

module.exports = Line
