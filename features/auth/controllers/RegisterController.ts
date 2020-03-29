import {AuthService} from '../auth'

export class RegisterController {
    static serviceName = 'RegisterController'
    static dependencies = ['AuthService']
    constructor(
        private authService: AuthService,
    ) {}
    register = async (request: any) => {
        const user = request.params
        const validatedUser = {
            email: (user.email || '').trim(),
            password: (user.password || '').trim(),
            name: (user.name || '').trim(),
        }
        const accessToken = await this.authService.registerUser(validatedUser)
        if (accessToken) {
            return {
                status: 200,
                data: accessToken,
            }
        } else {
            return {
                status: 400,
            }
        }
    }
}
