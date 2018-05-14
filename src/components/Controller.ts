export default class Controller {
	private id: number

	static lastId: number = 0

	constructor() {
		this.id = ++Controller.lastId
	}

	public getId = () => {
		return this.id
	}
}
