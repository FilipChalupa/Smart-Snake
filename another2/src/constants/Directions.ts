enum Direction {
	up = 0,
	right = 1,
	down = 2,
	left = 3,
}

export const positionDelta = (
	direction: Direction
): { x: number; y: number } => {
	switch (direction) {
		case Direction.up:
			return {
				x: 0,
				y: -1,
			}
		case Direction.right:
			return {
				x: 1,
				y: 0,
			}
		case Direction.down:
			return {
				x: 0,
				y: 1,
			}
		case Direction.left:
			return {
				x: -1,
				y: 0,
			}
		default:
			return {
				x: 0,
				y: 0,
			}
	}
}

export const turnLeft = (direction: Direction): Direction => {
	return (direction + 3) % 4
}

export const turnRight = (direction: Direction): Direction => {
	return (direction + 1) % 4
}

export default Direction
