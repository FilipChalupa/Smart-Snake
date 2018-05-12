import * as WebSocket from 'ws'
import Game from './Game'
import MessageTypes from '../constants/MessageTypes'
import SnakeController from './SnakeController'

export default class ClientOnServer {
	private socket: WebSocket
	private log: (text: string) => void
	private game: Game
	private onDisconnected: () => void
	private controllers: {
		[key: string]: SnakeController
	} = {}
	private lastControllerId = 0

	constructor(
		socket: WebSocket,
		log: (text: string) => void,
		game: Game,
		onDisconnected: () => void
	) {
		this.socket = socket
		this.log = log
		this.game = game
		this.onDisconnected = onDisconnected

		this.log('Client connected')

		this.send(MessageTypes.board, this.game.getBoardSize())

		this.attachListeners()
	}

	private attachListeners() {
		this.socket.on('message', this.onMessage)
		this.socket.on('close', this.onClose)
	}

	public send(type: MessageTypes, data: any) {
		this.socket.send(
			JSON.stringify({
				[type]: data,
			})
		)
	}

	private onMessage = (raw: string) => {
		const message = JSON.parse(raw) // Unsafe

		Object.keys(message).forEach(key => {
			const type = parseInt(key, 10)
			const data = message[key]

			this.log(`Message: ${MessageTypes[type]} '${JSON.stringify(data)}'`)

			switch (type) {
				case MessageTypes.addController:
					this.addController()
					break
				case MessageTypes.turnLeft:
					this.onLeft(data as number)
					break
				case MessageTypes.turnRight:
					this.onRight(data as number)
					break
				default:
					this.log('Message not recognised')
			}
		})
	}

	private onLeft(id: number) {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnLeft()
		}
	}

	private onRight(id: number) {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnRight()
		}
	}

	private addController() {
		const id = ++this.lastControllerId
		this.controllers[id] = this.game.spawnSnake()

		this.send(MessageTypes.toBeControlled, id)
	}

	private onClose = () => {
		this.log('Client disconnected')
	}

	// @TODO: implement ping pong with socket.terminate()
}
