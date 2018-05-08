const SPACING = 3

export default class Snake {
	public draw(
		c: CanvasRenderingContext2D,
		xStart: number,
		yStart: number,
		fieldSize: number
	) {
		c.beginPath()
		c.fillStyle = '#000000'
		c.rect(
			Math.round(xStart + SPACING),
			Math.round(yStart + SPACING),
			Math.round(fieldSize - 2 * SPACING),
			Math.round(fieldSize - 2 * SPACING)
		)
		c.fill()
	}
}
