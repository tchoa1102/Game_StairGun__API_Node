module.exports = class NearestPolygon {
	constructor() {
		this.polygon = null
		this.line = {
			first: null,
			last: null,
		}
		this.distance = Infinity
	}
}