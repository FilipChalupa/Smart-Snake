export default class Empty {
	public isObstacle() {
		return false
	}

	public isFood() {
		return false
	}

	public draw(
		c: CanvasRenderingContext2D,
		xStart: number,
		yStart: number,
		fieldSize: number
	) {}
}
