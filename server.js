
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

const updatePosition = (oldPosition, direction) => {
	return {
		x: ((oldPosition.x + (direction === DIRECTIONS.right ? 1 : (direction === DIRECTIONS.left ? -1 : 0))) + FIELD_SIZE.width) % FIELD_SIZE.width,
		y: ((oldPosition.y + (direction === DIRECTIONS.bottom ? 1 : (direction === DIRECTIONS.top ? -1 : 0))) + FIELD_SIZE.height) % FIELD_SIZE.height,
	}
}

wss.on('connection', (ws) => {
	const id = ++lastClientId

	const log = (text) => {
		console.log(`[${id}] ${text}`)
	}

	log('New connection')

	ws.send(JSON.stringify({ 'message': 'Hello' }))

	players[id] = {
		position: {
			x: 0,
			y: 0,
		},
		direction: DIRECTIONS.right,
		ws,
	}

	ws.on('message', (message) => {
		const data = JSON.parse(message)

		if (typeof data.direction === 'number' && data.direction >= 0 && data.direction <= 3) {
			players[id].direction = data.direction
			log('Direction changed to', players[id].direction)
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
	const rawPayload = {
		players: [],
	}

	ids.forEach((id) => {
		const player = players[id]
		player.position = updatePosition(player.position, player.direction)
		rawPayload.players.push({
			id,
			x: player.position.x,
			y: player.position.y,
		})
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
