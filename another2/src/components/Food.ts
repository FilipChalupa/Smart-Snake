import { BoardFieldContent } from './Board'

const SPACING = 0.025

export default class Food {
	private x: number
	private y: number
	private claim: (x: number, y: number) => void
	private release: (x: number, y: number) => void
	public eat: () => void

	constructor(
		x: number,
		y: number,
		claim: (x: number, y: number, content: BoardFieldContent) => void,
		release: (x: number, y: number) => void,
		onEat: () => void
	) {
		this.claim = (x: number, y: number) => claim(x, y, this)
		this.release = release
		this.updatePosition(x, y)
		this.eat = onEat
	}

	public isObstacle() {
		return false
	}

	public isFood() {
		return true
	}

	public updatePosition(x: number, y: number) {
		if (this.x || this.y) {
			this.release(this.x, this.y)
		}

		this.x = x
		this.y = y
		this.claim(x, y)
	}

	public draw(
		c: CanvasRenderingContext2D,
		xStart: number,
		yStart: number,
		fieldSize: number
	) {
		c.beginPath()
		c.fillStyle = '#FF0000'
		c.arc(
			xStart + fieldSize / 2,
			yStart + fieldSize / 2,
			fieldSize / 2 * (1 - SPACING),
			0,
			2 * Math.PI
		)
		c.fill()
	}
}
