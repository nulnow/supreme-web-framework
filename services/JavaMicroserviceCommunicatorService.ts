import {HTTPClientService} from './HTTPClientService'
import {ConfigurationService} from './ConfigurationService'

export class JavaMicroserviceCommunicatorService {
    static serviceName = 'JavaMicroserviceCommunicatorService'
    static dependencies = ['HTTPClientService', 'ConfigurationService']

    constructor(
        private httpClientService: HTTPClientService,
        private configurationService: ConfigurationService,
    ) {}

    checkIsAlive = () => new Promise(async (resolve) => {
        try {
            const response = await this.httpClientService.get(`${this.configurationService.JAVA_SERVICE_URL}/ping`)

            resolve(true)
        } catch (e) {
            console.error(e)
            resolve(false)
        }
        setTimeout(async () => {
            resolve(false)
        }, +this.configurationService.MICROSERVICES_RESPONSE_TIMEOUT_MS)
    })

    getUser = () => new Promise(async (resolve, reject) => {
        try {
            const response = await this.httpClientService.get(`${this.configurationService.JAVA_SERVICE_URL}/user`)
            resolve(response)
        } catch (e) {
            console.error(e)
            reject()
        }
        setTimeout(async () => {
            reject()
        }, +this.configurationService.MICROSERVICES_RESPONSE_TIMEOUT_MS)
    })
}
