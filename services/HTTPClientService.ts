import axios from 'axios'

export class HTTPClientService {
    static serviceName = 'HTTPClientService'
    constructor() {}
    get = (...args: any) => {
        // @ts-ignore
        return axios.get(...args)
    }
    post = (...args: any) => {
        // @ts-ignore
        return axios.post(...args)
    }
}
