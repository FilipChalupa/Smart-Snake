import Game from './components/Game'
import SnakeController from './components/SnakeController'

const game = new Game(16, 9)
let controller: SnakeController = null

document.addEventListener('keydown', event => {
	const { key } = event

	if (key === 'ArrowLeft') {
		if (controller) {
			controller.turnLeft()
		}
	} else if (key === 'ArrowRight') {
		if (controller) {
			controller.turnRight()
		}
	} else if (key === ' ') {
		controller = game.spawnSnake()
	} else if (key === 'ArrowUp') {
		game.tick()
	} else if (key === 'f') {
		game.spawnFood()
	}
})

// setTimeout(() => {
// 	this.move()
// }, 1000 / 5)
