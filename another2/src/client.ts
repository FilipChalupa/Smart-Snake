import Game from './components/Game'
import SnakeController from './components/SnakeController'
import MessageTypes from './constants/MessageTypes'

class Client {
	private game: Game = null
	private controllers: SnakeController[] = []
	private localControllers: {
		[key: number]: number
	} = {}
	private socket: WebSocket

	constructor() {
		this.socket = new WebSocket(`ws://${document.location.hostname}:8002`)

		this.socket.onopen = () => {
			console.log('Connection established')
			this.send(MessageTypes.addController, {})
			this.send(MessageTypes.addController, {})
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
				this.onLeft(1)
			} else if (key === 'ArrowRight') {
				this.onRight(1)
			} else if (key === 'k') {
				this.onLeft(2)
			} else if (key === 'l') {
				this.onRight(2)
			} /*else if (key === ' ') {
				controller = game.spawnSnake()
			} else if (key === 'ArrowUp') {
				game.tick()
			} else if (key === 'f') {
				game.spawnFood()
			}*/
		})
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

	private onLeft(localId: number) {
		if (typeof this.localControllers[localId] !== 'undefined') {
			this.send(MessageTypes.turnLeft, this.localControllers[localId])
		}
	}

	private onRight(localId: number) {
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
