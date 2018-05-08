import Board from './Board'
import Food from './Food'
import Snake from './Snake'

export default class Game {
	private width: number
	private height: number
	private board: Board
	private food: Food
	private snakes: Snake[] = []

	constructor(width: number, height: number) {
		this.width = width
		this.height = height

		this.board = new Board(width, height)
		this.food = new Food(
			1,
			2,
			(x: number, y: number) => {
				this.board.claim(x, y, this.food)
			},
			(x: number, y: number) => {
				this.board.release(x, y)
			}
		)

		const snake1 = new Snake()
		this.snakes.push(snake1)
		this.board.claim(2, 2, snake1)
		this.board.claim(2, 3, snake1)
		this.board.claim(2, 4, snake1)
		this.board.claim(3, 4, snake1)
		this.board.claim(4, 4, snake1)

		this.foodRandomPlace()
	}

	private foodRandomPlace = () => {
		this.food.updatePosition(
			Math.floor(this.width * Math.random()),
			Math.floor(this.height * Math.random())
		)
		setTimeout(this.foodRandomPlace, 1000)
	}
}
