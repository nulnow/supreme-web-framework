export class AuthenticationIsRequiredMiddleware {
    static serviceName = 'AuthenticationIsRequiredMiddleware'
    run = async (request: any, socket: any) => {
        if (!request.user) {
            throw { status: 401 }
        }
    }
}
