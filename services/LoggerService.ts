
export class LoggerService {
    static serviceName = 'LoggerService'

    log(...args: any) {
        return console.log(...args)
    }

    error(...args: any) {
        return console.log(...args)
    }

    debug(...args: any) {
        return console.log(...args)
    }

}
