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
}

module.exports = Line
