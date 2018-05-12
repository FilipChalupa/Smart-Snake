import Snake from './Snake'
import Food from './Food'

export type BoardFieldContent = Food | Snake
export type BoardFieldContentNullable = BoardFieldContent | null

export default class Board {
	private width: number
	private height: number
	private fields: BoardFieldContentNullable[][]
	private playBoardCanvas: HTMLCanvasElement = typeof document === 'undefined'
		? null
		: document.querySelector('.playBoard-canvas')
	private canvasContext: CanvasRenderingContext2D = null

	private widthInPixels: number
	private heightInPixels: number
	private fieldSize: number
	private xStartOffset: number
	private yStartOffset: number

	//private food: Food
	//private snakes: Snake[] = []

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
		this.widthInPixels = this.playBoardCanvas.clientWidth
		this.heightInPixels = this.playBoardCanvas.clientHeight
		this.playBoardCanvas.setAttribute('width', this.widthInPixels.toString())
		this.playBoardCanvas.setAttribute('height', this.heightInPixels.toString())

		this.fieldSize = Math.min(
			this.widthInPixels / this.width,
			this.heightInPixels / this.height
		)

		this.xStartOffset = (this.widthInPixels - this.width * this.fieldSize) / 2
		this.yStartOffset = (this.heightInPixels - this.height * this.fieldSize) / 2

		this.draw()
	}

	public isInBoard = (x: number, y: number): boolean => {
		return x >= 0 && x < this.width && y >= 0 && y < this.height
	}

	public claim = (
		x: number,
		y: number,
		content: BoardFieldContent
	): BoardFieldContentNullable => {
		if (this.isInBoard(x, y)) {
			const previousContent = this.fields[x][y]
			if (previousContent !== null) {
				this.clearField(x, y)
			}
			this.fields[x][y] = content

			if (this.canvasContext) {
				this.drawField(x, y)
			}
			return previousContent
		} else {
			return null
		}
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
		const xStart = this.xStartOffset + x * this.fieldSize
		const yStart = this.yStartOffset + y * this.fieldSize

		this.canvasContext.clearRect(
			Math.round(xStart),
			Math.round(yStart),
			Math.round(this.fieldSize),
			Math.round(this.fieldSize)
		)
	}

	private drawField(x: number, y: number) {
		const content = this.fields[x][y]

		const xStart = this.xStartOffset + x * this.fieldSize
		const yStart = this.yStartOffset + y * this.fieldSize

		if (content) {
			content.draw(this.canvasContext, xStart, yStart, this.fieldSize)
		} else {
			this.clearField(x, y)
		}
	}

	public draw() {
		const c = this.canvasContext

		c.clearRect(0, 0, this.widthInPixels, this.heightInPixels)

		c.beginPath()
		c.rect(0, 0, this.widthInPixels, this.heightInPixels)
		c.fillStyle = '#000000'
		c.fill()

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.drawField(x, y)
			}
		}
	}
}
