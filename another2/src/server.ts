import * as WebSocket from 'ws'
import Game from './components/Game'
import SnakeController from './components/SnakeController'
import ClientOnServer from './components/ClientOnServer'
import MessageTypes from './constants/MessageTypes'

class Server {
	private lastClientId: number = 0
	private clients: {
		[key: string]: ClientOnServer
	} = {}
	private loopCounter: number = 0
	private game: Game

	static port = 8002
	static board = {
		width: 16,
		height: 9,
	}

	constructor() {
		this.game = new Game(Server.board.width, Server.board.height)
		this.game.spawnFood()

		const wss = new WebSocket.Server({ port: Server.port })
		console.log(`Server running at port ${Server.port}`)
		wss.on('connection', socket => {
			const id = `${++this.lastClientId}`

			this.clients[id] = new ClientOnServer(
				socket,
				this.log(id),
				this.game,
				() => {
					delete this.clients[id]
				}
			)
		})

		this.loop()
	}

	private loop = () => {
		this.send(MessageTypes.tick, this.loopCounter)
		this.game.tick()
		this.loopCounter++

		setTimeout(this.loop, 1000 / 1)
	}

	private send(type: MessageTypes, data: any) {
		Object.keys(this.clients).forEach(id => {
			this.clients[id].send(type, data)
		})
	}

	private log(id: string) {
		return (text: string) => {
			console.log(`[${id}] ${text}`)
		}
	}
}

new Server()
