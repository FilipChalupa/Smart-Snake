import { BoardFieldContent } from './Board'

const SPACING = 0

export default class Food {
	private x: number
	private y: number
	private claim: (x: number, y: number) => void
	private release: (x: number, y: number) => void

	constructor(
		x: number,
		y: number,
		claim: (x: number, y: number, content: BoardFieldContent) => void,
		release: (x: number, y: number, content: BoardFieldContent) => void
	) {
		this.claim = (x: number, y: number) => claim(x, y, this)
		this.release = (x: number, y: number) => release(x, y, this)
		this.updatePosition(x, y)
	}

	public isObstacle() {
		return false
	}

	public isFood() {
		return true
	}

	public getPosition() {
		return {
			x: this.x,
			y: this.y,
		}
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
			xStart + fieldSize / 3,
			yStart + fieldSize / 3,
			fieldSize / 3 - SPACING,
			0,
			2 * Math.PI
		)
		c.fill()
	}
}
