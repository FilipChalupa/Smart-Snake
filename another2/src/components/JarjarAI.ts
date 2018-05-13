import SnakeController from './SnakeController'
import { BoardFieldContent } from './Board'
import Snake from './Snake'
import { positionDelta, turnLeft, turnRight } from '../constants/Directions'

export default class JarjarAI {
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

		let forwardPositionX = position.x + delta.x
		let forwardPositionY = position.y + delta.y

		if (!this.getContent(forwardPositionX, forwardPositionY).isObstacle()) {
			canForward = true
		}

		let closestFoodForwardDistance = 1000
		for (let i = 1; i <= 200; i++) {
			forwardPositionX = position.x + i * delta.x
			forwardPositionY = position.y + i * delta.y
			if (this.getContent(forwardPositionX, forwardPositionY).isObstacle()) {
				closestFoodForwardDistance += 200 - i
				break
			}
			if (this.getContent(forwardPositionX, forwardPositionY).isFood()) {
				if (i < closestFoodForwardDistance) {
					closestFoodForwardDistance = i
				}
			}
		}

		const leftDirection = turnLeft(direction)
		delta = positionDelta(leftDirection)
		let leftPositionX = position.x + delta.x
		let leftPositionY = position.y + delta.y

		if (!this.getContent(leftPositionX, leftPositionY).isObstacle()) {
			canLeft = true
		}

		let closestFoodLeftDistance = 1000
		for (let i = 1; i <= 200; i++) {
			leftPositionX = position.x + i * delta.x
			leftPositionY = position.y + i * delta.y
			if (this.getContent(leftPositionX, leftPositionY).isObstacle()) {
				closestFoodLeftDistance += 200 - i
				break
			}
			if (this.getContent(leftPositionX, leftPositionY).isFood()) {
				if (i < closestFoodLeftDistance) {
					closestFoodLeftDistance = i
				}
			}
		}

		const rightDirection = turnRight(direction)
		delta = positionDelta(rightDirection)
		let rightPositionX = position.x + delta.x
		let rightPositionY = position.y + delta.y
		if (!this.getContent(rightPositionX, rightPositionY).isObstacle()) {
			canRight = true
		}

		let closestFoodRightDistance = 1000
		for (let i = 1; i <= 200; i++) {
			rightPositionX = position.x + i * delta.x
			rightPositionY = position.y + i * delta.y
			if (this.getContent(rightPositionX, rightPositionY).isObstacle()) {
				closestFoodRightDistance += 200 - i
				break
			}
			if (this.getContent(rightPositionX, rightPositionY).isFood()) {
				if (i < closestFoodRightDistance) {
					closestFoodRightDistance = i
				}
			}
		}

		const smallestFoodDistance = Math.min(
			Math.min(closestFoodForwardDistance, closestFoodLeftDistance),
			closestFoodRightDistance
		)
		if (smallestFoodDistance >= 1000) {
			if (smallestFoodDistance == closestFoodForwardDistance) {
				return
			} else if (smallestFoodDistance == closestFoodLeftDistance) {
				this.turnLeft()
				return
			} else if (smallestFoodDistance == closestFoodRightDistance) {
				this.turnRight()
				return
			}
		} else if (closestFoodForwardDistance == smallestFoodDistance) {
			return
		} else if (closestFoodLeftDistance == smallestFoodDistance) {
			this.turnLeft()
			return
		} else if (closestFoodRightDistance == smallestFoodDistance) {
			this.turnRight()
			return
		}

		if (canForward) {
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
