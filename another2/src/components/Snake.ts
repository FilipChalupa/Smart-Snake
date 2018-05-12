import Direction, {
	positionDelta,
	turnLeft,
	turnRight,
} from '../constants/directions'
import { BoardFieldContent, BoardFieldContentNullable } from './Board'
import { truncate } from 'fs'
import Food from './Food'

const SPACING = 0.05

interface Position {
	x: number
	y: number
}

export default class Snake {
	private x: number
	private y: number
	private path: Position[] = []
	private color: string
	private direction: Direction
	private hasChangedDirection: boolean = false
	private pendingDirection: 'left' | 'right' | null = null
	private claim: (x: number, y: number) => BoardFieldContentNullable
	private release: (x: number, y: number) => void
	private eat: (food: Food) => void

	constructor(
		x: number,
		y: number,
		color: string,
		claim: (
			x: number,
			y: number,
			content: BoardFieldContent
		) => BoardFieldContentNullable,
		release: (x: number, y: number, content: BoardFieldContent) => void,
		eat: (food: Food) => void
	) {
		this.x = x
		this.y = y
		this.path.push({ x, y })
		this.direction = Direction.up
		this.color = color
		this.claim = (x: number, y: number) => claim(x, y, this)
		this.release = (x: number, y: number) => release(x, y, this)
		this.eat = eat

		this.move()
	}

	public getDirection() {
		return this.direction
	}

	public isObstacle() {
		return true
	}

	public isFood() {
		return false
	}

	public move() {
		const delta = positionDelta(this.direction)
		this.hasChangedDirection = false
		this.x += delta.x
		this.y += delta.y

		this.path.push({ x: this.x, y: this.y })
		const claimedContent = this.claim(this.x, this.y)

		if (claimedContent === null || !claimedContent.isFood()) {
			const tail = this.path.shift()
			this.release(tail.x, tail.y)
		} else {
			//Food reached
			this.eat(claimedContent as Food)
		}

		if (this.pendingDirection !== null) {
			const pending = this.pendingDirection
			this.pendingDirection = null
			if (pending === 'left') {
				this.turnLeft()
			} else if (pending === 'right') {
				this.turnRight()
			}
		}
	}

	public turnLeft() {
		if (this.hasChangedDirection) {
			this.pendingDirection = 'left'
		} else {
			this.hasChangedDirection = true
			this.direction = turnLeft(this.direction)
		}
	}

	public turnRight() {
		if (this.hasChangedDirection) {
			this.pendingDirection = 'right'
		} else {
			this.hasChangedDirection = true
			this.direction = turnRight(this.direction)
		}
	}

	public draw(
		c: CanvasRenderingContext2D,
		xStart: number,
		yStart: number,
		fieldSize: number
	) {
		c.beginPath()
		c.fillStyle = this.color
		c.rect(
			Math.round(xStart + SPACING * fieldSize),
			Math.round(yStart + SPACING * fieldSize),
			Math.round(fieldSize - 2 * SPACING * fieldSize),
			Math.round(fieldSize - 2 * SPACING * fieldSize)
		)
		c.fill()
	}
}
