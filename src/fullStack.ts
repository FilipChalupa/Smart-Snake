import * as express from 'express'
import * as http from 'http'
import * as path from 'path'
import Server from './components/Server'
import port from './constants/port'

const app = express().use(express.static(path.join(__dirname, '../dist')))
const server = http.createServer(app)

new Server(server)

server.listen(port, () => {
	console.log(`Server started on port ${port}`)
})
