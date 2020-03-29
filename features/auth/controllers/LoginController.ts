import {AuthService} from '../services/AuthService'

export class LoginController {
    static serviceName = 'LoginController'
    static dependencies = ['AuthService']
    constructor(
        private authService: AuthService,
    ) {}
    login = async (request: any) => {
        const credentials = request.params
        const res = await this.authService.loginUser((credentials.email || '').trim(), (credentials.password || '').trim())
        if (res) {
            return {
                status: 200,
                data: res

            }
        } else {
            return {
                status: 400,
            }
        }
    }
}
