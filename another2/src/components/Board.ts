import Snake from './Snake'
import Food from './Food'

type FieldContent = Food | Snake

export default class Board {
	private width: number
	private height: number
	private fields: (FieldContent | null)[][]
	private playBoardCanvas: HTMLCanvasElement = document.querySelector(
		'.playBoard-canvas'
	)
	private canvasContext: CanvasRenderingContext2D

	private widthInPixels: number
	private heightInPixels: number
	private fieldSize: number
	private xStartOffset: number
	private yStartOffset: number

	//private food: Food
	//private snakes: Snake[] = []

	constructor(width: number, height: number) {
		this.canvasContext = this.playBoardCanvas.getContext('2d')

		this.width = width
		this.height = height

		this.fields = [...Array(this.width)]
		for (let x = 0; x < this.width; x++) {
			this.fields[x] = [...Array(this.height)]
		}

		window.addEventListener('resize', this.onResize)
		this.onResize()
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
	}

	public claim(x: number, y: number, content: FieldContent) {
		this.fields[x][y] = content
		this.drawField(x, y)
	}

	public release(x: number, y: number) {
		this.fields[x][y] = null
		this.drawField(x, y)
	}

	private drawField(x: number, y: number) {
		const content = this.fields[x][y]

		const xStart = this.xStartOffset + x * this.fieldSize
		const yStart = this.yStartOffset + y * this.fieldSize

		if (content) {
			content.draw(this.canvasContext, xStart, yStart, this.fieldSize)
		} else {
			this.canvasContext.clearRect(
				Math.round(xStart),
				Math.round(yStart),
				Math.round(this.fieldSize),
				Math.round(this.fieldSize)
			)
		}
	}

	public draw() {
		const c = this.canvasContext

		c.clearRect(0, 0, this.widthInPixels, this.heightInPixels)

		c.beginPath()
		c.rect(
			Math.round(this.xStartOffset),
			Math.round(this.yStartOffset),
			Math.round(this.width * this.fieldSize),
			Math.round(this.height * this.fieldSize)
		)
		c.stroke()

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.drawField(x, y)
			}
		}
	}
}
