import {AuthService} from '../auth'
import {LoggerService} from '../../../services/LoggerService'

export class AuthenticationMiddleware {
    static serviceName = 'AuthenticationMiddleware'
    static dependencies = ['AuthService', 'LoggerService']

    constructor(
        private authService: AuthService,
        private loggerService: LoggerService,
    ) {}

    run = async (request: any, socket: any) => {
        this.loggerService.debug('Running AuthenticationMiddleware')

        const { method, params, opts } = request

        if (!opts) return
        const token = opts.token

        if (!token) return

        const user = await this.authService.getUserFromToken(token)

        if (user) {
            request.user = user
            if (socket) {
                socket.id = user._id
            }

        }
        request.user = await this.authService.getUserFromToken(token)
        socket
    }

}
