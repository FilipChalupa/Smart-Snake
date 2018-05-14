import Snake from './Snake'
import Controller from './Controller'

export default class SnakeController extends Controller {
	private snake: Snake

	constructor(snake: Snake) {
		super()
		this.snake = snake
	}

	public turnLeft = () => {
		this.snake.turnLeft()
	}

	public turnRight = () => {
		this.snake.turnRight()
	}

	public getColor = () => {
		this.snake.getColor()
	}

	public isAlive() {
		return this.snake.isAlive()
	}

	public getSnake = (): Snake => {
		return this.snake
	}
}
