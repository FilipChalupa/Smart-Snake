import * as express from 'express'
import * as path from 'path'
import * as http from 'http'
import port from './constants/port'
import Server from './components/Server'

const app = express().use(express.static(path.join(__dirname, '../dist')))
const server = http.createServer(app)

new Server(server)

server.listen(port, () => {
	console.log(`Server started on port ${server.address().port}`)
})
