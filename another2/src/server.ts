import Game from './components/Game'
import SnakeController from './components/SnakeController'

const game = new Game(16, 9)
let controller: SnakeController = null

controller = game.spawnSnake()
game.spawnFood()

let loopCounter: number = 0

const loop = () => {
	game.tick()
	loopCounter++

	if (loopCounter % 5 === 0) {
		controller.turnLeft()
	}

	setTimeout(loop, 1000 / 5)
}

loop()
