import SnakeController from './SnakeController'
import { BoardFieldContent } from './Board'
import Snake from './Snake'
import { positionDelta, turnLeft, turnRight } from '../constants/Directions'

export default class OfeckaAI {
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
		const forwardDirection = this.snake.getDirection()

		const options = []

		options.push({
			direction: forwardDirection,
			actionToTake: () => {},
			wallDistance: Number.MAX_VALUE,
			foodDistance: Number.MAX_VALUE,
		})
		options.push({
			direction: turnLeft(forwardDirection),
			actionToTake: this.turnLeft,
			wallDistance: Number.MAX_VALUE,
			foodDistance: Number.MAX_VALUE,
		})
		options.push({
			direction: turnRight(forwardDirection),
			actionToTake: this.turnRight,
			wallDistance: Number.MAX_VALUE,
			foodDistance: Number.MAX_VALUE,
		})

		options.forEach(option => {
			const delta = positionDelta(option.direction)

			for (let i = 1; i <= this.boardWidth; i++) {
				const content = this.getContent(
					position.x + delta.x * i,
					position.y + delta.y * i
				)
				if (content.isObstacle()) {
					option.wallDistance = i
					break
				} else if (content.isFood()) {
					option.foodDistance = i
					break
				}
			}
		})

		const bestOption = options.reduce((best, current) => {
			if (current.foodDistance < best.foodDistance) {
				return current
			} else if (current.wallDistance > best.wallDistance) {
				return current
			} else {
				return best
			}
		})

		bestOption.actionToTake()
	}
}
