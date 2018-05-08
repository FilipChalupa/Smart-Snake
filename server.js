
const WebSocket = require('ws')
const gameLoop = require('node-gameloop')

console.log('Start')

const wss = new WebSocket.Server({ port: 8080 })

const FIELD_SIZE = {
	width: 50,
	height: 50,
}

const DIRECTIONS = {
	top: 0,
	right: 1,
	bottom: 2,
	left: 3,
}

let lastClientId = 0
const players = {}
const foodPosition = {
	x: 0,
	y: 0,
}

const randomizeFoodPosition = () => {
	foodPosition.x = Math.floor(Math.random() * FIELD_SIZE.width)
	foodPosition.y = Math.floor(Math.random() * FIELD_SIZE.height)
}

randomizeFoodPosition()

const getFoodPayload = () => {
	return {
		food: { ...foodPosition },
	}
}

const getScorePayload = (playerId) => {
	return {
		score: [{
			id: playerId,
			value: players[playerId].score,
		}],
	}
}

const getScoresPayload = (playerId) => {
	return {
		score: Object.keys(players).map((id) => ({
			id,
			value: players[id].score,
		}))
	}
}

const getFieldSizePayload = () => {
	return {
		field: {
			...FIELD_SIZE,
		},
	}
}

const getWelcomePayload = (playerId) => {
	return {
		welcome: {
			id: playerId,
		},
		...getFieldSizePayload(),
		...getFoodPayload(),
		...getScoresPayload(),
	}
}

const updatePosition = (oldPosition, direction) => {
	return {
		x: ((oldPosition.x + (direction === DIRECTIONS.right ? 1 : (direction === DIRECTIONS.left ? -1 : 0))) + FIELD_SIZE.width) % FIELD_SIZE.width,
		y: ((oldPosition.y + (direction === DIRECTIONS.bottom ? 1 : (direction === DIRECTIONS.top ? -1 : 0))) + FIELD_SIZE.height) % FIELD_SIZE.height,
	}
}

wss.on('connection', (ws) => {
	const id = `${++lastClientId}`

	const log = (text) => {
		console.log(`[${id}] ${text}`)
	}

	log('New connection')

	players[id] = {
		position: {
			x: 0,
			y: 0,
		},
		score: 0,
		direction: DIRECTIONS.right,
		ws,
	}

	ws.send(JSON.stringify(getWelcomePayload(id)))

	ws.on('message', (message) => {
		const data = JSON.parse(message)

		if (typeof data.direction === 'number' && data.direction >= 0 && data.direction <= 3) {
			players[id].direction = data.direction
		}

		log(message)
	})

	ws.on('close', () => {
		log('Disconnected')
		delete players[id]
	})
})

const gameLoopId = gameLoop.setGameLoop((delta) => {
	const ids = Object.keys(players)
	let rawPayload = {
		positions: [],
	}

	ids.forEach((id) => {
		const player = players[id]
		player.position = updatePosition(player.position, player.direction)

		rawPayload.positions.push({
			id,
			x: player.position.x,
			y: player.position.y,
		})
	})

	ids.forEach((id) => {
		const player = players[id]
		if (player.position.x === foodPosition.x && player.position.y === foodPosition.y) {
			player.score++
			randomizeFoodPosition()
			rawPayload.food = foodPosition
			rawPayload = {
				...rawPayload,
				...getScorePayload(id),
			}
		}
	})

	const payload = JSON.stringify(rawPayload)
	ids.forEach((id) => {
		const player = players[id]
		player.ws.send(payload)
	})
}, 1000 / 30)


process.on('SIGINT', () => {
	console.log('Bye bye')
	gameLoop.clearGameLoop(gameLoopId)
	wss.close()
	process.exit()
})
