import * as WebSocket from 'ws'
import Game from './Game'
import MessageTypes from '../constants/MessageTypes'

export default class ClientOnServer {
	private socket: WebSocket
	private log: (text: string) => void
	private boardWidth: number
	private boardHeight: number
	private spawnSnake: () => number
	private turnLeft: (id: number) => void
	private turnRight: (id: number) => void
	private onDisconnected: () => void
	private controllers: {
		[key: string]: boolean
	} = {}

	constructor(
		socket: WebSocket,
		log: (text: string) => void,
		boardWidth: number,
		boardHeight: number,
		spawnSnake: () => number,
		turnLeft: (id: number) => void,
		turnRight: (id: number) => void,
		onDisconnected: () => void
	) {
		this.socket = socket
		this.log = log
		this.boardWidth = boardWidth
		this.boardHeight = boardHeight
		this.spawnSnake = spawnSnake
		this.turnLeft = turnLeft
		this.turnRight = turnRight
		this.onDisconnected = onDisconnected

		this.log('Client connected')

		this.send(MessageTypes.board, {
			width: this.boardWidth,
			height: this.boardHeight,
		})

		this.attachListeners()
	}

	private attachListeners() {
		this.socket.on('message', this.onMessage)
		this.socket.on('close', this.onClose)
	}

	public send(type: MessageTypes, data: any) {
		if (this.socket.readyState === 1) {
			this.socket.send(
				JSON.stringify({
					[type]: data,
				})
			)
		} else {
			this.log('Sending data failed')
		}
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
		if (typeof this.controllers[id]) {
			this.turnLeft(id)
		}
	}

	private onRight(id: number) {
		if (typeof this.controllers[id]) {
			this.turnRight(id)
		}
	}

	private addController() {
		const id = this.spawnSnake()
		this.controllers[id] = true
		this.send(MessageTypes.toBeControlled, id)
	}

	private onClose = () => {
		this.log('Client disconnected')
		this.onDisconnected()
	}

	// @TODO: implement ping pong with socket.terminate()
}
