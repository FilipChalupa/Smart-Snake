import Food from './Food'
import Controller from './Controller'

export default class FoodController extends Controller {
	private food: Food

	constructor(food: Food) {
		super()
		this.food = food
	}
}
