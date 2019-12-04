/* eslint-disable no-case-declarations */
//websocket as class
import http from 'http'
import * as CONFIG from '../src/config.json'
import { getUniqueID, userRegisterHandler } from './srvHelpers'
export class WebSocket {
    constructor() {
        this.clients = []
        this.initialBoard = this.getInitialBoard()
        this.playersReady = Number(0)
        this.ready = Number(0)
        this.port = CONFIG.SRV_PORT
        this.server = http.createServer()
        this.webSocketServer = require('websocket').server
        this.wsServer = new this.webSocketServer({ httpServer: this.server })
        this.wsServer.on('request', this.handleConnection.bind(this))
    }

    start() {
        console.time('started in')
        this.server.listen(this.port)
        console.log(
            '\n*̱̹̦̳ͦͥ̀ͥ͐\n**\n***\nStarted SudokuServer with following settings (∩ᵔ ͜ʖᵔ)⊃━☆ﾟ.*:'
        )
        console.table({
            SRV_PORT: CONFIG.SRV_PORT,
            DEV_ENV: CONFIG.DEV_ENV,
        })
        console.table(CONFIG.attackTypes)
        console.groupEnd()
        console.timeEnd('started in')
        console.log('\nヽ(⌣ ͜ʖ⌣”)ﾉ')
    }
    stop() {
        this.server.close()
    }
    addClient(connection, userID) {
        this.clients.push({
            userid: userID,
            connection: connection
        })
        console.log(`connected: ${userID} from  ${connection.remoteAddress}`)
    }
    removeClient(id) {
        let clients = [...this.clients]
        let clientIndex = clients.findIndex(client => client.userid === id)
        clients.splice(clientIndex, 1)
        this.clients = clients
    }

    handleConnection(request) {
        const connection = request.accept(null, request.origin)
        let userID = getUniqueID()
        this.addClient(connection, userID)
        connection.on('message', message => {
            if (message.type !== 'utf8') {
                return
            }
            this.handleRequest(message, userID)
        })
        connection.on('close', () => {
            console.log('User', userID, 'has left the game.')
            let client = this.getClientByType('userid', userID)
            if (!isNaN(client.player)) {
                this.ready = this.ready > 0 ? this.ready - 1 : this.ready
                this.playersReady = this.playersReady - 1
                console.log('was a player, making room for new players')
            }
            this.removeClient(userID)
        })
    }
    sendMessage(data, filter = {}) {
        let clients = this.getClients(filter)
        data = JSON.stringify(data)
        for (let i = 0; i < clients.length; i++) {
            clients[i].connection.sendUTF(data)
        }
        console.log('MESSAGE WE SENT TO CLIENT:', filter, JSON.parse(data))
    }
    handleRequest(message, userID) {
        let request = JSON.parse(message.utf8Data)
        console.log('request', request)
        let json = { type: request.type }
        let output
        switch (request.type) {
        case CONFIG.reqTypes.USER_EVENT:
            output = userRegisterHandler(
                request,
                this.clients,
                userID,
                this.playersReady,
                json
            )
            json.data = output && output.json ? output.json : '' ///solve this if empty
            this.sendMessage(json)
            break
        case CONFIG.reqTypes.READYUP:
            this.ready = this.ready + 1
            console.log(this.ready)
            if (this.ready >= 2) {
                this.sendMessage(json)
            }

            break
        }
    }
    getClients(filter = {}) {
        let clients = this.clients.filter(client => {
            let keys = Object.keys(filter)
            for (let i = 0; i < keys.length;) {
                if (client[keys[i]] !== filter[keys[i]]) {
                    return false
                }
                i++
            }
            return true
        })
        return clients
    }
    getClientByType(type, filter) {
        return this.clients.find(client => client[type] === filter)
    }
    getClientIndex(userid) {
        return this.clients.findIndex(client => client.userid === userid)
    }
    setClients(userid, key, content) {
        let client = this.getClientByType('userid', userid)
        client[key] = content

        let index = this.getClientIndex(userid)
        if (index === -1) {
            index = 0
        }
        this.clients[index] = client
    }


}

export default WebSocket
