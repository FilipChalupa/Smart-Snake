
const WebSocket = require('ws')
const gameLoop = require('node-gameloop')

console.log('Start')

const wss = new WebSocket.Server({ port: 8080 })

const FIELD_SIZE = {
	width: 50,
	height: 50,
}

let lastClientId = 0

wss.on('connection', (ws) => {
	const id = ++lastClientId

	const log = (text) => {
		console.log(`[${id}] ${text}`)
	}

	ws.on('message', (message) => {
		log(message)
	})

	ws.send('Hello')
})

const gameLoopId = gameLoop.setGameLoop((delta) => {
	console.log('tick')
}, /* 1000 / 30 */1000)


process.on('SIGINT', () => {
	console.log('Bye bye')
	gameLoop.clearGameLoop(gameLoopId)
	wss.close()
	process.exit()
})
