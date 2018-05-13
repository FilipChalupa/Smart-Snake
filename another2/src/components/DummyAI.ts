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
		const possibleActions: Array<() => void> = []

		const direction = this.snake.getDirection()
		let delta = positionDelta(direction)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			possibleActions.push(() => {})
		}

		const leftDirection = turnLeft(direction)
		delta = positionDelta(leftDirection)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			possibleActions.push(this.turnLeft)
		}

		const rightDirection = turnRight(direction)
		delta = positionDelta(rightDirection)
		if (
			!this.getContent(position.x + delta.x, position.y + delta.y).isObstacle()
		) {
			possibleActions.push(this.turnRight)
		}

		if (possibleActions.length > 0) {
			if (possibleActions.length === 3 && Math.random() < 0.3) {
				possibleActions[0]()
			} else {
				possibleActions[Math.floor(Math.random() * possibleActions.length)]()
			}
		}
	}
}
