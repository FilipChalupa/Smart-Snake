import Board, { BoardFieldContent } from './Board'
import Food from './Food'
import Snake from './Snake'
import SnakeController from './SnakeController'
import FoodController from './FoodController'
import * as randomSeed from 'random-seed'

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

	public getContent = (x: number, y: number): BoardFieldContent => {
		return this.board.getContent(x, y)
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
		this.foodRandomPlace(food)

		return new FoodController(food)
	}

	public spawnFoods = (count: number) => {
		for (let i = 0; i < count; i++) {
			this.spawnFood()
		}
	}

	public tick = () => {
		this.move()
	}

	private eat = (food: Food) => {
		this.foodRandomPlace(food)
	}

	private foodRandomPlace = (food: Food) => {
		const random = randomSeed.create(JSON.stringify(food.getPosition()))

		let tries = 0
		while (tries < 50) {
			const x = random.intBetween(0, this.width - 1)
			const y = random.intBetween(0, this.height - 1)
			const content = this.board.getContent(x, y)

			if (!content.isFood() && !content.isObstacle()) {
				food.updatePosition(x, y)
				break
			}
			tries++
		}
	}

	private move = () => {
		this.snakes.forEach((snake: Snake, i: number) => {
			snake.move()
		})
	}
}
