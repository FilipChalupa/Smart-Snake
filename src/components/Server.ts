import * as WebSocket from 'ws'
import Game from './Game'
import SnakeController from './SnakeController'
import ClientOnServer from './ClientOnServer'
import MessageTypes from '../constants/MessageTypes'
import port from '../constants/port'
import boardSize from '../constants/boardSize'
import initialFoodCount from '../constants/initialFoodCount'
import ticksPerSecond from '../constants/ticksPerSecond'

export default class Server {
	private lastClientId: number = 0
	private clients: {
		[key: string]: ClientOnServer
	} = {}
	private loopCounter: number = 0
	private game: Game
	private controllers: {
		[key: number]: SnakeController
	} = {}

	static board = {
		width: boardSize,
		height: boardSize,
	}

	constructor(server?: any) {
		this.game = new Game(Server.board.width, Server.board.height)

		this.game.spawnFoods(initialFoodCount)

		const wss = new WebSocket.Server(server ? { server } : { port: port })
		wss.on('connection', socket => {
			const id = `${++this.lastClientId}`

			this.clients[id] = new ClientOnServer(
				socket,
				this.log(id),
				Server.board.width,
				Server.board.height,
				this.spawnSnake,
				this.turnLeft,
				this.turnRight,
				() => {
					delete this.clients[id]
				}
			)
		})

		this.loop()
	}

	private spawnSnake = (color: string): number => {
		const controller = this.game.spawnSnake(color)
		const id = controller.getId()

		this.controllers[id] = controller
		this.send(MessageTypes.addController, { id, color })

		return id
	}

	private turnLeft = (id: number) => {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnLeft()
			this.send(MessageTypes.turnLeft, id)
		}
	}

	private turnRight = (id: number) => {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnRight()
			this.send(MessageTypes.turnRight, id)
		}
	}

	private loop = () => {
		this.send(MessageTypes.tick, this.loopCounter)
		this.game.tick()
		this.loopCounter++

		setTimeout(this.loop, 1000 / ticksPerSecond)
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
