import SnakeController from './SnakeController'

export default class DummyAI {
	private turnLeft: () => void
	private turnRight: () => void

	constructor(turnLeft: () => void, turnRight: () => void) {
		this.turnLeft = turnLeft
		this.turnRight = turnRight

		setInterval(() => {
			this.turnRight()
		}, 2000)
	}
}
