import Empty from './Empty'
import Food from './Food'
import Snake from './Snake'
import Wall from './Wall'

export type BoardFieldContent = Food | Snake | Wall | Empty
export type BoardFieldContentNullable = BoardFieldContent | null

export default class Board {
	private width: number
	private height: number
	private fields: BoardFieldContentNullable[][]
	private playBoard: HTMLDivElement =
		typeof document === 'undefined'
			? null
			: document.querySelector('.playBoard')
	private playBoardCanvas: HTMLCanvasElement =
		typeof document === 'undefined'
			? null
			: document.querySelector('.playBoard-canvas')
	private canvasContext: CanvasRenderingContext2D = null

	private widthInPixels: number
	private heightInPixels: number
	private fieldSize: number

	static wall = new Wall()
	static empty = new Empty()

	constructor(width: number, height: number) {
		if (this.playBoardCanvas) {
			this.canvasContext = this.playBoardCanvas.getContext('2d')
		}

		this.width = width
		this.height = height

		this.fields = []
		for (let x = 0; x < this.width; x++) {
			this.fields.push([])
			for (let y = 0; y < this.width; y++) {
				this.fields[x][y] = null
			}
		}

		if (typeof window !== 'undefined') {
			window.addEventListener('resize', this.onResize)
			this.onResize()
		}
	}

	private onResize = () => {
		const wrapperWidth = this.playBoard.clientWidth
		const wrapperHeight = this.playBoard.clientHeight

		this.fieldSize = Math.floor(
			Math.min(wrapperWidth / this.width, wrapperHeight / this.height),
		)

		this.widthInPixels = this.fieldSize * this.width
		this.heightInPixels = this.fieldSize * this.height

		this.playBoardCanvas.setAttribute('width', this.widthInPixels.toString())
		this.playBoardCanvas.setAttribute('height', this.heightInPixels.toString())

		this.draw()
	}

	public isInBoard = (x: number, y: number): boolean => {
		return x >= 0 && x < this.width && y >= 0 && y < this.height
	}

	public getContent = (x: number, y: number): BoardFieldContent => {
		if (this.isInBoard(x, y)) {
			const content = this.fields[x][y]
			if (content) {
				return content
			} else {
				return Board.empty
			}
		} else {
			return Board.wall
		}
	}

	public claim = (
		x: number,
		y: number,
		content: BoardFieldContent,
	): BoardFieldContent => {
		const oldContent = this.getContent(x, y)

		if (!oldContent.isObstacle()) {
			this.fields[x][y] = content
			if (this.canvasContext) {
				this.clearField(x, y)
				this.drawField(x, y)
			}
		}

		return oldContent
	}

	public release = (x: number, y: number, content: BoardFieldContent) => {
		if (this.isInBoard(x, y) && content === this.fields[x][y]) {
			this.fields[x][y] = null
			if (this.canvasContext) {
				this.drawField(x, y)
			}
		}
	}

	private clearField = (x: number, y: number) => {
		const xStart = x * this.fieldSize
		const yStart = y * this.fieldSize

		this.canvasContext.clearRect(xStart, yStart, this.fieldSize, this.fieldSize)
	}

	private drawField(x: number, y: number) {
		const content = this.fields[x][y]

		const xStart = x * this.fieldSize
		const yStart = y * this.fieldSize

		if (content) {
			content.draw(this.canvasContext, xStart, yStart, this.fieldSize)
		} else {
			this.clearField(x, y)
		}
	}

	public draw() {
		const c = this.canvasContext

		c.beginPath()
		c.rect(0, 0, this.widthInPixels, this.heightInPixels)
		c.fillStyle = '#000000'
		c.fill()

		c.clearRect(0, 0, this.widthInPixels, this.heightInPixels)

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.drawField(x, y)
			}
		}
	}
}
