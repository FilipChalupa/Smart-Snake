import Game from './components/Game'
import SnakeController from './components/SnakeController'
import MessageTypes from './constants/MessageTypes'
import DummyAI from './components/DummyAI'
import OfeckaAI from './components/OfeckaAI'

enum AIType {
	Dummy,
	Ofecka,
}

class Client {
	private game: Game = null
	private controllers: {
		[key: string]: SnakeController
	} = {}
	private localControllers: {
		[key: string]: number
	} = {}
	private socket: WebSocket
	private spawningAI: null | AIType = null
	private ais: {
		[key: string]: DummyAI | OfeckaAI
	} = {}

	constructor() {
		this.socket = new WebSocket(`ws://${document.location.hostname}:8002`)

		this.socket.onopen = () => {
			console.log('Connection established')
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
						this.addRemoteController(data)
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

	private requestController(color: string) {
		this.send(MessageTypes.addController, { color })
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
			} else if (key === 'i') {
				this.spawnAI(AIType.Dummy)
			} else if (key === 'a') {
				this.spawnAI(AIType.Ofecka)
			} else if (key === 's') {
				this.spawnLocal()
			}
		})
	}

	private spawnLocal() {
		const color = `rgb(
			${Math.floor(100 + Math.random() * 150)},
			${Math.floor(100 + Math.random() * 150)},
			${Math.floor(100 + Math.random() * 150)}
		)`
		this.requestController(color)
	}

	private spawnAI(type: AIType) {
		this.spawningAI = type

		const color = `rgb(
			0,
			${type === AIType.Dummy ? Math.floor(100 + Math.random() * 150) : 0},
			${type === AIType.Ofecka ? Math.floor(100 + Math.random() * 150) : 0}
		)`
		this.requestController(color)
	}

	private addRemoteController(data: { id: number; color: string }) {
		const controller = this.game.spawnSnake(data.color)
		const { id } = data
		this.controllers[id] = controller
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
		if (this.spawningAI !== null) {
			this.spawningAI = null

			const AI = this.spawningAI === AIType.Dummy ? DummyAI : OfeckaAI

			const boardSize = this.game.getBoardSize()
			this.ais[id] = new AI(
				boardSize.width,
				boardSize.height,
				this.controllers[id].getSnake(),
				this.game.getContent,
				() => {
					this.send(MessageTypes.turnLeft, id)
				},
				() => {
					this.send(MessageTypes.turnRight, id)
				}
			)
		} else {
			if (typeof this.localControllers[1] === 'undefined') {
				this.localControllers[1] = id
			} else if (typeof this.localControllers[2] === 'undefined') {
				this.localControllers[2] = id
			} else {
				console.log('No more available local controllers')
			}
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

		this.game.spawnFoods(1000)
	}

	private tick = () => {
		if (this.game) {
			this.game.tick()
		}

		Object.keys(this.ais).forEach(id => {
			this.ais[id].plan()
		})
	}
}

new Client()
