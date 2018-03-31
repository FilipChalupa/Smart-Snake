document.addEventListener('keydown', (event) => {
	const keyName = event.key
	let direction = null

	switch (keyName) {
		case 'ArrowUp':
			direction = 0
			break
		case 'ArrowRight':
			direction = 1
			break
		case 'ArrowDown':
			direction = 2
			break
		case 'ArrowLeft':
			direction = 3
			break
	}

	if (direction !== null) {
		ws.send(JSON.stringify({ direction }))
	}
})


let MAX_X = 50
let MAX_Y = 50

function printPlayers(players) {
	for(var i in players){
		if($("#player" + i).length === 0) {
			$(".playground").append("<div id=\"player" + i + "\" class=\"player\"</div>")
		}
		$("#player" + i).css({
			"left" : 100/MAX_X * players[i].posX + "%",
			"top" : 100/MAX_Y * players[i].posY + "%",
			"width" : 100/MAX_X + "%",
			"height" : 100/MAX_Y + "%",
		})
	}
}


const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
	console.log('Connection established')
}

ws.onmessage =  (event) => {
	console.log('Message', event.data)
	const data = JSON.parse(event.data)

	if (typeof data.players !== 'undefined') {
		printPlayers(data.players.map((player) => ({
			posX: player.x,
			posY: player.y,
		})))
	}
}

ws.onclose = () => {
	console.log('Connection lost')
}
