import {ConfigurationService} from './ConfigurationService'
import {Express} from 'express'
import express = require('express')
import * as path from 'path'
import http from "http"
import {LoggerService} from './LoggerService'
import proxy from 'express-http-proxy'

export class StaticService {
    static serviceName: string = 'StaticService'
    static dependencies: string[] = ['ConfigurationService', 'LoggerService']

    private app: Express
    private server: http.Server

    constructor(
        private configurationService: ConfigurationService,
        private loggerService: LoggerService,
    ) {
        const app = express()
        this.server = http.createServer(app)
        this.app = app
        app.use(express.static(path.resolve('./client/dist')))
        app.use('/call', proxy(`http://127.0.0.1:${this.configurationService.GW_PORT}/call`))
        app.get('*', (req, res) => {
            res.sendFile(path.resolve('./client/build/index.html'))
        })
    }

    start = async () => {
        this.server.listen(this.configurationService.STATIC_PORT, () => {
            this.loggerService.log(`WEB IS LISTENING ON PORT ${this.configurationService.STATIC_PORT}`)
        })
    }

}
