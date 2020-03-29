import * as features from './features/features'
import {ConfigurationService} from './services/ConfigurationService'
import {LoggerService} from './services/LoggerService'
import {HTTP_GW_Service} from './services/HTTP_GW_Service'
import {ServiceContainer} from './services/ServiceContainer'
import {AuthenticationMiddleware} from './features/auth/middlewares/AuthenticationMiddleware'
import {AuthenticationIsRequiredMiddleware} from './features/auth/middlewares/AuthenticationIsRequiredMiddleware'
import {AuthService} from './features/auth/services/AuthService'
import {HTTPClientService} from './services/HTTPClientService'
import {JavaMicroserviceCommunicatorService} from './services/JavaMicroserviceCommunicatorService'
import {UsersController, UsersService} from './features/users/users'
import {RealtimeService} from './services/RealtimeService'
import {EventsService} from './services/EventsService'
import {StaticService} from './services/StaticService'
import {ModelsService} from './services/ModelsService'


// const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})

class IndexController {
    static serviceName = 'IndexController'
    static dependencies = ['ConfigurationService', 'JavaMicroserviceCommunicatorService']

    constructor(
        private configurationService: ConfigurationService,
        private javaMicroserviceCommunicatorService: JavaMicroserviceCommunicatorService,
    ) {}

    index = async () => {
        return {
            status: 200,
            data: 'hello world ' + this.configurationService.GW_PORT,
        }
    }

    javaPing = async () => {
        if (await this.javaMicroserviceCommunicatorService.checkIsAlive()) {
            return {
                status: 200,
                data: 'alive',
            }
        } else {
            return {
                status: 200,
                data: 'dead',
            }
        }
    }

    profile = async (request: any) => {
        return {
            status: 200,
            data: request.user
        }
    }

    getUser = async () => {
        try {
            return {
                status: 200,
                // @ts-ignore
                data: (await this.javaMicroserviceCommunicatorService.getUser()).data
            }
        } catch(e) {
            return {
                status: 500
            }
        }
    }
}

const container = new ServiceContainer()
;[
    LoggerService,
    UsersService,
    UsersController,
    RealtimeService,
    EventsService,
    ConfigurationService,
    IndexController,
    AuthenticationIsRequiredMiddleware,
    AuthenticationMiddleware,
    HTTPClientService,
    JavaMicroserviceCommunicatorService,
    AuthService,
    HTTP_GW_Service,
    StaticService,
    ModelsService,
].forEach(container.registerService)
Object.values(features).forEach((feature: any) => {
    Object.values(feature).forEach((featureService: any) => {
        container.registerService(featureService)
    })
})
container.buildSingletons()
container.startSingletons()

container.resolveSingleton('LoggerService').debug('started')

/*
fetch('/call', { method: 'POST', body: JSON.stringify({ method: '/java/getUser' }), headers: { 'Content-Type':'application/json' } }).then(r => r.json()).then(console.log)
 */
