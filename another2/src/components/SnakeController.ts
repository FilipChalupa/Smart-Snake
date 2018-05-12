import Snake from './Snake'

export default class SnakeController {
	private snake: Snake

	constructor(snake: Snake) {
		this.snake = snake
	}

	public turnLeft = () => {
		this.snake.turnLeft()
	}
	public turnRight = () => {
		this.snake.turnRight()
	}
}
