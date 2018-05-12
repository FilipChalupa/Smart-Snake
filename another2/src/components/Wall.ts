const SPACING = 0.025

export default class Wall {
	public isObstacle() {
		return true
	}

	public isFood() {
		return false
	}

	public draw(
		c: CanvasRenderingContext2D,
		xStart: number,
		yStart: number,
		fieldSize: number
	) {
		c.beginPath()
		c.fillStyle = '#000000'
		c.rect(
			Math.round(xStart + SPACING * fieldSize),
			Math.round(yStart + SPACING * fieldSize),
			Math.round(fieldSize - 2 * SPACING * fieldSize),
			Math.round(fieldSize - 2 * SPACING * fieldSize)
		)
		c.fill()
	}
}
