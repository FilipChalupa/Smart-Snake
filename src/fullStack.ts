import * as express from 'express'
import * as path from 'path'
import port from './constants/port'
import Server from './components/Server'

express()
	.use(express.static(path.join(__dirname, '../dist')))
	.listen(port, () => {
		console.log(`Listening on port ${port}`)
	})

//new Server()
