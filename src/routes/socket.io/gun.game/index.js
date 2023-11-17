const configGame = require('../../../gameConfig.json')
const NearestPolygon = require('./nearestPolygon')
const UpdateLocationRes = require('./updateLocationRes')

module.exports = function(socket, io) {
	const gunGame = new GunGame(socket, io)

	socket.on('gun-game/to-left', (data) => gunGame.toLeft(data))
	socket.on('gun-game/to-right', (data) => gunGame.toRight(data))
	socket.on('gun-game/gun', (data) => gunGame.gun(data))
	socket.on('gun-game/use-card', (data) => gunGame.useCard(data))
}

class GunGame {
	constructor(socket, io) {
		this.socket = socket
		this.io = io
		this._id = socket.handshake.idPlayer
		this.vx = 1
	}

	// on: gun-game/to-left | emit: gun-game/update-location
	toLeft() {
		try {
			const playerData = this.socket.handshake.match.player
			const objsMap = this.socket.handshake.match.objects
			const playerShape = createShapePlayer(
				playerData.mainGame.bottomLeft.x,
				playerData.mainGame.bottomLeft.y,
				playerData.mainGame.characterGradient
			)

			const nearest = nearestNeighborPolygon(playerShape, objsMap)
			console.log(nearest)

			if (Math.isFinite(bottomNearest.distance)) {
				const res = new UpdateLocationRes(this._id, [{
					x: playerData.mainGame.bottomLeft.x,
					y: playerData.mainGame.bottomLeft.y,
					angle: 90,
					time: new Date().getTime()
				}], false)
				return this.io.to(this.socket.handshake.idRoom).emit('gun-game/players/update-location', res)
			}

			const distanceCanIncrease = Math.min(1, nearest.leftLineNearest.distance)
			playerData.mainGame.bottomLeft.x += distanceCanIncrease
			playerData.mainGame.bottomLeft.y = -findYFromYInStraightLine(
				playerData.mainGame.bottomLeft.x,
				nearest.leftLineNearest.line.first,
				nearest.leftLineNearest.line.last
			)

			playerData.mainGame.characterGradient = calculateAngle(nearest.leftLineNearest.line.first, nearest.leftLineNearest.line.last)

			const res = new UpdateLocationRes(this._id, [{
				x: playerData.mainGame.bottomLeft.x,
				y: playerData.mainGame.bottomLeft.y,
				angle: 90,
				time: new Date().getTime()
			}], true)
			return this.io.to(this.socket.handshake.idRoom).emit('gun-game/players/update-location', res)
		} catch(e) {
			console.log(e)
			return
		}
	}

	toRight() {
		try {

		} catch(e) {
			console.log(e)
			return
		}
	}

	gun({ angle, force }) {
		try {

		} catch(e) {
			console.log(e)
			return
		}
	}

	useCard({cardId}) {
		try {

		} catch(e) {
			console.log(e)
			return
		}
	}

	useSkill({ skillId }) {
		try {

		} catch(e) {
			console.log(e)
			return
		}
	}
}

function getLocationOnOxy(location, point) {
	return {
		x: point.x + location.x,
		y: -(point.y + Math.abs(location.y)),
	}
}

function nearestNeighborPolygon(main_shape, polygons) {
	// const rightNearest = new NearestPolygon()
	const bottomNearest = new NearestPolygon()
	// const leftNearest = new NearestPolygon()

	// right and left must only have line, enough
	const rightLineNearest = new NearestPolygon()
	const leftLineNearest = new NearestPolygon()

	for(const polygon of polygons) {
		const points = polygon.data.points
		const numEdge = points.length
		for(let i = 0; i < numEdge; ++i) {
			const indexLastEdge = (i+1) % numEdge
			const f_edge = getLocationOnOxy(polygon.location, points[i])
			const l_edge = getLocationOnOxy(polygon.location, points[indexLastEdge])

			calculateMinDistance(bottomNearest, polygon, main_shape[2], main_shape[3], f_edge, l_edge, 'x')
			nearestNeighborLine(rightLineNearest, main_shape[1], main_shape[2], f_edge, l_edge, 'y')
			nearestNeighborLine(leftLineNearest, main_shape[0], main_shape[3], f_edge, l_edge, 'y')
		}
	}

	return {rightLineNearest, bottomNearest, leftLineNearest}

	function calculateMinDistance(nearestPolygon, polygon, main_first_point, main_last_point, polygon_first_point, polygon_last_point, condition_for) {
		const check = checkInside(main_first_point, main_last_point, polygon_first_point, polygon_last_point, condition_for)
		if (!check) return

		const distance_first = calculateDistanceToEdge(main_first_point, polygon_first_point, polygon_last_point)
		const distance_last = calculateDistanceToEdge(main_last_point, polygon_first_point, polygon_last_point)
		const distance = Math.min(distance_first, distance_last)
		if (nearestPolygon.distance > distance) {
			nearestPolygon.distance = distance
			nearestPolygon.polygon = polygon
			nearestPolygon.line.first = polygon_first_point
			nearestPolygon.line.last = polygon_last_point
		}
	}
}

function nearestNeighborLine(nearestLine, main_first_point, main_last_point, line_first_point, line_last_point, condition_for) {
	const check = checkInside(main_first_point, main_last_point, line_first_point, line_last_point, condition_for)
	if (!check) return

	const distance_first = calculateDistanceToEdge(main_first_point, line_first_point, line_last_point)
	const distance_last = calculateDistanceToEdge(main_last_point, line_first_point, line_last_point)
	const distance = Math.min(distance_first, distance_last)
	if (nearestLine.distance > distance) {
		nearestLine.distance = distance
		nearestLine.line.first = polygon_first_point
		nearestLine.line.last = polygon_last_point
	}
}

function checkInside(main_first_point, main_last_point, polygon_first_point, polygon_last_point, condition_for) {
	const m_f = main_first_point[condition_for]
	const m_l = main_last_point[condition_for]
	const p_f = polygon_first_point[condition_for]
	const p_l = polygon_last_point[condition_for]

	const twoPointAreAllLarger = (m_f > p_f && m_l > p_f && m_f > p_l && m_l > p_l)
	const twoPointAreAllSmaller = (m_f < p_f && m_l < p_f && m_f < p_l && m_l < p_l)
	return !(twoPointAreAllSmaller || twoPointAreAllLarger)
}

function calculateDistanceToEdge(point, f_edge, l_edge) {
	const a = f_edge.y - l_edge.y
	const b = l_edge.x - f_edge.x
	const c = f_edge.x * l_edge.y - l_edge.x * f_edge.y
	const numerator = Math.abs(a * point.x + b * point.y + c)
	const denominator = Math.sqrt(a**2 + b**2)

	return numerator / denominator
}

//   h
// ______ 1 2
// |	|
// |	| w
// |	|
// ______ 4 3
// x: left-top: 1, right-top: 2, right-bottom: 3, left-bottom: 4
function createShapePlayer(x3, y3, angle) {
	// create shape on 90deg
	const height = configGame.person.height
	const width = configGame.person.width
	const shape = [
		{x: x3 - height, y: -(y3 - width)},
		{x: x3, y: -(y3 - width)},
		{x: x3, y: -y3},
		{x: x3 - height, y: -y3},
	]
	derectionVector(shape[2], shape[0], angle)
	derectionVector(shape[2], shape[1], angle)
	derectionVector(shape[2], shape[3], angle)
	return shape
}

function derectionVector(p_center, p_derect, angle) {
	v = {
		x: p_derect.x - p_center.x,
		y: p_derect.y - p_center.y
	}

	const angleRad = angle * Math.PI / 180
	p_derect.x = p_center.x + v.x * Math.cos(angleRad) + v.y * Math.sin(angleRad)
	p_derect.y = p_center.y - v.x * Math.sin(angleRad) + v.y * Math.cos(angleRad)
}

function isPointInPolygon(point, vertices) {
	const numVertices = vertices.length
	let intersections = 0

	for(let i = 0; i < numVertices; i++) {
		const indexLastPoint = (i+1) % numVertices
		const f_point = vertices[i]
		const l_point = vertices[indexLastPoint]

		if ((f_point.y <= point.y && point.y < l_point.y) ||
			(l_point.y <= point.y && point.y < f_point.y)) {
			if (point.x < (l_point.x - f_point.x) * (point.y - f_point.y) / (l_point.y - f_point.y) + f_point.x)
				intersections += 1
		}
	}

	return intersections % 2 === 1
}

function findYFromYInStraightLine(x, point1, point2) {
	return -(point1.y - point2.y) * (x - point1.x) / (point2.x - point1.x) + point1.y
}

//  true RightAngle | => newAngle = v + g = v + arctan(rightAngle_l_p / rightAngle_f_p)
//      |\
//      |v\	v=90			v = 0
// f_p o\---|o  rightAngle   o---/o l_p
//       \g |       |	     |  /
//        \ |       |	     |g/
//         \|o l_p  |  f_p  o|/
function calculateAngle(f_p, l_p) {
	const rightAngle = {
		x: f_p.x,
		y: l_p.y,
	}
	let tempAngle = 0

	if (l_p.y < f_p.y) {
		rightAngle.x = l_p.x
		rightAngle.y = f_p.y
		tempAngle = 90
	}

	const lineNear = Math.sqrt((f_p.x - rightAngle.x)**2 + (f_p.y - rightAngle.y)**2)
	const lineFront = Math.sqrt((l_p.x - rightAngle.x)**2 + (l_p.y - rightAngle.y)**2)

	return tempAngle + Math.atan(lineFront / lineNear)
}