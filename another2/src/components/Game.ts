import Board from './Board'
import Food from './Food'
import Snake from './Snake'
import SnakeController from './SnakeController'
import Direction from '../constants/directions'
import FoodController from './FoodController'

export default class Game {
	private width: number
	private height: number
	private board: Board
	private foods: Food[] = []
	private snakes: Snake[] = []

	constructor(width: number, height: number) {
		this.width = width
		this.height = height

		this.board = new Board(width, height)

		const snake1 = new Snake(
			10,
			7,
			'#550055',
			this.board.claim,
			this.board.release,
			this.eat
		)
		this.snakes.push(snake1)
		document.addEventListener('keydown', event => {
			const { key } = event
			const direction = snake1.getDirection()
			if (key === 'ArrowUp') {
				if (direction === Direction.left) {
					snake1.turnRight()
				} else if (direction === Direction.right) {
					snake1.turnLeft()
				}
			} else if (key === 'ArrowRight') {
				if (direction === Direction.up) {
					snake1.turnRight()
				} else if (direction === Direction.down) {
					snake1.turnLeft()
				}
			} else if (key === 'ArrowDown') {
				if (direction === Direction.left) {
					snake1.turnLeft()
				} else if (direction === Direction.right) {
					snake1.turnRight()
				}
			} else if (key === 'ArrowLeft') {
				if (direction === Direction.down) {
					snake1.turnRight()
				} else if (direction === Direction.up) {
					snake1.turnLeft()
				}
			}
		})

		const snake2 = new Snake(
			5,
			5,
			'#000055',
			this.board.claim,
			this.board.release,
			this.eat
		)
		this.snakes.push(snake2)
	}

	public spawnSnake = (): SnakeController => {
		const snake = new Snake(
			10,
			7,
			`rgb(${Math.floor(Math.random() * 200)},${Math.floor(
				Math.random() * 200
			)},${Math.floor(Math.random() * 200)})`,
			this.board.claim,
			this.board.release,
			this.eat
		)
		this.snakes.push(snake)

		return new SnakeController(snake)
	}

	public spawnFood = (): FoodController => {
		const food = new Food(1, 2, this.board.claim, this.board.release)
		this.foods.push(food)

		return new FoodController(food)
	}

	public tick = () => {
		this.move()
	}

	public eat = (food: Food) => {
		this.foodRandomPlace(food)
	}

	private foodRandomPlace = (food: Food) => {
		food.updatePosition(
			Math.floor(this.width * Math.random()),
			Math.floor(this.height * Math.random())
		)
	}

	private move = () => {
		this.snakes.forEach((snake: Snake, i: number) => {
			snake.move()
			if (i === 1 && Math.random() < 0.3) {
				if (Math.random() < 0.5) {
					snake.turnRight()
				} else {
					snake.turnLeft()
				}
			}
		})
	}
}
