import Game from './components/Game'
import SnakeController from './components/SnakeController'
import MessageTypes from './constants/MessageTypes'

class Client {
	private game: Game = null
	private controllers: {
		[key: number]: SnakeController
	} = {}
	private localControllers: {
		[key: number]: number
	} = {}
	private socket: WebSocket

	constructor() {
		this.socket = new WebSocket(`ws://${document.location.hostname}:8002`)

		this.socket.onopen = () => {
			console.log('Connection established')
			this.send(MessageTypes.addController, {})
			//this.send(MessageTypes.addController, {})
		}

		this.socket.onmessage = event => {
			const message = JSON.parse(event.data)

			Object.keys(message).forEach(key => {
				const type = parseInt(key, 10)
				const data = message[key]

				console.log(`Message: ${MessageTypes[type]} '${JSON.stringify(data)}'`)

				switch (type) {
					case MessageTypes.board:
						this.initBoard(data.width, data.height)
						break
					case MessageTypes.tick:
						this.tick()
						break
					case MessageTypes.toBeControlled:
						this.addLocalController(data as number)
						break
					case MessageTypes.addController:
						this.addRemoteController(data as number)
						break
					case MessageTypes.turnLeft:
						this.onRemoteLeft(data as number)
						break
					case MessageTypes.turnRight:
						this.onRemoteRight(data as number)
						break
					default:
						console.log('Message not recognised')
				}
			})
		}

		this.socket.onclose = () => {
			console.log('Connection lost')
		}

		this.attachListeners()
	}

	private send(type: MessageTypes, data: any) {
		this.socket.send(
			JSON.stringify({
				[type]: data,
			})
		)
	}

	private attachListeners() {
		document.addEventListener('keydown', event => {
			const { key } = event

			if (key === 'ArrowLeft') {
				this.onLocalLeft(1)
			} else if (key === 'ArrowRight') {
				this.onLocalRight(1)
			} else if (key === 'k') {
				this.onLocalLeft(2)
			} else if (key === 'l') {
				this.onLocalRight(2)
			}
		})
	}

	private addRemoteController(id: number) {
		this.controllers[id] = this.game.spawnSnake()
	}

	private onRemoteLeft(id: number) {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnLeft()
		}
	}

	private onRemoteRight(id: number) {
		if (typeof this.controllers[id] !== 'undefined') {
			this.controllers[id].turnRight()
		}
	}

	private addLocalController(id: number) {
		if (typeof this.localControllers[1] === 'undefined') {
			this.localControllers[1] = id
		} else if (typeof this.localControllers[2] === 'undefined') {
			this.localControllers[2] = id
		} else {
			console.log('No more available local controllers')
		}
	}

	private onLocalLeft(localId: number) {
		if (typeof this.localControllers[localId] !== 'undefined') {
			this.send(MessageTypes.turnLeft, this.localControllers[localId])
		}
	}

	private onLocalRight(localId: number) {
		if (typeof this.localControllers[localId] !== 'undefined') {
			this.send(MessageTypes.turnRight, this.localControllers[localId])
		}
	}

	private initBoard = (width: number, height: number) => {
		this.game = new Game(width, height)
	}

	private tick = () => {
		if (this.game) {
			this.game.tick()
		}
	}
}

new Client()
