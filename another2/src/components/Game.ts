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
	}

	public getBoardSize = () => {
		return {
			width: this.width,
			height: this.height,
		}
	}

	public spawnSnake = (color: string): SnakeController => {
		const snake = new Snake(
			0,
			0,
			color,
			this.board.getContent,
			this.board.claim,
			this.board.release,
			this.eat
		)
		this.snakes.push(snake)

		return new SnakeController(snake)
	}

	public spawnFood = (): FoodController => {
		const food = new Food(0, 1, this.board.claim, this.board.release)
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
		while (true) {
			// @TODO: fix infinite loop for full board
			const x = Math.floor(this.width * Math.random())
			const y = Math.floor(this.height * Math.random())
			const content = this.board.getContent(x, y)

			if (!content.isFood() && !content.isObstacle()) {
				food.updatePosition(x, y)
				break
			}
		}
	}

	private move = () => {
		this.snakes.forEach((snake: Snake, i: number) => {
			snake.move()
		})
	}
}
