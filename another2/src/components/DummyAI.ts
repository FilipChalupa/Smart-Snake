import SnakeController from './SnakeController'
import { BoardFieldContent } from './Board'
import Snake from './Snake'
import { positionDelta, turnLeft, turnRight } from '../constants/Directions'

export default class DummyAI {
	private boardWidth: number
	private boardHeight: number
	private snake: Snake
	private getContent: (x: number, y: number) => BoardFieldContent
	private turnLeft: () => void
	private turnRight: () => void

	constructor(
		boardWidth: number,
		boardHeight: number,
		snake: Snake,
		getContent: (x: number, y: number) => BoardFieldContent,
		turnLeft: () => void,
		turnRight: () => void
	) {
		this.boardWidth = boardWidth
		this.boardHeight = boardHeight
		this.snake = snake
		this.getContent = getContent
		this.turnLeft = turnLeft
		this.turnRight = turnRight
	}

	public plan() {
		const position = this.snake.getPosition()

		let canForward = false
		let canLeft = false
		let canRight = false

		const direction = this.snake.getDirection()
		let delta = positionDelta(direction)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			canForward = true
		}

		const leftDirection = turnLeft(direction)
		delta = positionDelta(leftDirection)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			canLeft = true
		}

		const rightDirection = turnRight(direction)
		delta = positionDelta(rightDirection)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			canRight = true
		}

		if (canForward && (canLeft || canRight) && Math.random() < 0.98) {
			return
		}

		if (canLeft && canRight) {
			if (Math.random() < 0.5) {
				this.turnLeft()
			} else {
				this.turnRight()
			}
		} else {
			if (canLeft) {
				this.turnLeft()
			} else if (canRight) {
				this.turnRight()
			}
		}
	}
}
