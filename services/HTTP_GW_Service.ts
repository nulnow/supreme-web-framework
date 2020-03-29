import http from 'http'
import {Express} from 'express'
import express = require('express')
import bodyParser from 'body-parser'
import io from 'socket.io'
import {LoggerService} from './LoggerService'
import {ConfigurationService} from './ConfigurationService'
import {ServiceContainer} from './ServiceContainer'
import {RealtimeService} from './RealtimeService'
import cors from 'cors'

export class HTTP_GW_Service {
    static serviceName = 'HTTP_GW_Service'
    static dependencies = [
        'LoggerService',
        'ConfigurationService',
        'ServiceContainer',
        'RealtimeService',
    ]
    private server: http.Server
    private app: Express

    private sockets: any = []
    public getSockets = () => {
        return this.sockets
    }
    public setSockets = (newSockets: any) => {
        this.sockets = newSockets
    }

    static wrapControllerMethod = (method: any, logger: LoggerService = console) => {
        return async (req: { body: { params: any; opts: any; user: any; }; }, res: { json: (arg0: { data?: any; status: number; message?: string; }) => void; }) => {
            try {
                const { params, opts, user } = req.body
                const result = await method({ params, opts, user })
                res.json({
                    data: result,
                    status: 200,
                })
            } catch (e) {
                logger.error(e)
                res.json({
                    status: 500,
                    message: 'internal server error'
                })
            }
        }
    }

    private process = async (input: any, done: any, socket: any) => {
        console.log('process')
        try {
            if (!this.isInputValid(input)) {
                return done({
                    status: 400,
                    message: 'bad request'
                })
            }
            const { method, params, opts } = input
            const request = { method, params, opts }

            const findMethod = (methods: any, requestMethod: any) => {
                return methods.find((method: any) => {
                    return (new RegExp(method)).test(requestMethod)
                })
            }

            // @ts-ignore
            if (!findMethod(Object.keys(this.configurationService.ROUTE_CONFIG), method)) {
                return done({
                    status: 404,
                    message: 'not found'
                })
            }

            // @ts-ignore
            const [ mwsNames, action ] = this.configurationService.ROUTE_CONFIG[findMethod(Object.keys(this.configurationService.ROUTE_CONFIG), method)]
            const mws = mwsNames.map(this.injector.resolveSingleton)
            const globalMs = this.configurationService.GLOBAL_MWS.map(this.injector.resolveSingleton)

            try {

                for (let i = 0; i < (globalMs || []).length; i++) {
                    const mw = globalMs[i]
                    await mw.run(request, socket)
                }
                for (let i = 0; i < (mws || []).length; i++) {
                    const mw = mws[i]
                    await mw.run(request, socket)
                }
            } catch(e) {
                if (e.status) {
                    done({
                        status: e.status,
                    })
                } else {
                    throw e
                }
            }

            const [ controllerName, controllerAction ] = action.split('@')
            const controller = this.injector.resolveSingleton(controllerName)

            done(await controller[controllerAction](request))

        } catch(error) {
            this.loggerService.error(error)
            done({
                status: 500,
                message: 'internal server error'
            })
        }
    }

    private isInputValid = (input: any) => {
        try {
            const { opts, method, params } = input
            return true
        } catch(error) {
            return false
        }
    }

    constructor(
        private loggerService: LoggerService,
        private configurationService: ConfigurationService,
        private injector: ServiceContainer,
        private realtimeService: RealtimeService,
    ) {
        const app = express()
        this.app = app
        app.use(cors())
        app.use((req, res, next) => {
            console.log('request')
            console.log(req.path)
            next()
        })
        app.get('/', function (req, res) {
            res.send('GATEWAY IS RUNNING')
        })
        app.get('/ping', (req, res) => {
            res.send('pong')
        })
        app.use(bodyParser.json())
        app.post('/call', async (req, res) => {
            console.log('post call')
            this.process(req.body, (...args: any) => { res.json(...args) }, null)
        })
        const server = http.createServer(app)
        this.server = server
        const ioServer = io(server)
        ioServer.on('connection', (socket) => {
            this.realtimeService.registerSocket(socket)
            socket.on('call', async (input: any, done = () => {}) => {
                await this.process(input, done, socket)
            })
            socket.on('disconnect', (socket) => {
                this.realtimeService.unregisterSocket(socket)
            })
        })
    }

    start() {
        this.server.listen(this.configurationService.GW_PORT, () => {
            this.loggerService.log('App is listening on port ' + this.configurationService.GW_PORT)
        })
    }
}
