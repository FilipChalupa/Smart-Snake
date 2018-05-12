import * as WebSocket from 'ws'
import Game from './components/Game'
import SnakeController from './components/SnakeController'
import ClientOnServer from './components/ClientOnServer'

class Server {
	private lastClientId: number = 0
	private clients: {
		[key: string]: ClientOnServer
	} = {}

	static port = 8002
	static board = {
		width: 16,
		height: 9,
	}

	constructor() {
		const wss = new WebSocket.Server({ port: Server.port })
		console.log(`Server running at port ${Server.port}`)

		const game = new Game(Server.board.width, Server.board.height)
		let controller: SnakeController = null

		controller = game.spawnSnake()
		game.spawnFood()

		let loopCounter: number = 0

		const loop = () => {
			game.tick()
			loopCounter++

			if (loopCounter % 5 === 0) {
				controller.turnLeft()
			}

			setTimeout(loop, 1000 / 5)
		}

		loop()

		wss.on('connection', socket => {
			const id = `${++this.lastClientId}`

			this.clients[id] = new ClientOnServer(socket, this.log(id), game, () => {
				delete this.clients[id]
			})
		})
	}

	private log(id: string) {
		return (text: string) => {
			console.log(`[${id}] ${text}`)
		}
	}
}

new Server()
