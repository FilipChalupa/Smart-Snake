import Game from './components/Game'
import SnakeController from './components/SnakeController'

const game = new Game(16, 9)
let controller: SnakeController = null

controller = game.spawnSnake()
game.spawnFood()

const loop = () => {
	game.tick()
	setTimeout(loop, 1000 / 5)
}

loop()
