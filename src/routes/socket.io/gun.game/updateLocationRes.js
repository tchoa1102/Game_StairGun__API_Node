module.exports = class UpdateLocationRes {
	constructor(_idPlayer, data, isLive) {
		// data: Array<{x: number, y: number, angle: number, time: number}>
		this._id = _idPlayer
		this.data = data
		this.isLive = isLive
	}
}