import {User} from '../features/users/models/User'
import {ConfigurationService} from './ConfigurationService'
import mongoose = require('mongoose')


export class ModelsService {
    static serviceName: string = 'ModelsService'
    static dependencies: string[] = ['ConfigurationService']

    isReadyPromise: Promise<typeof import('mongoose')>

    UserModel = User
    constructor(
        private configurationService: ConfigurationService,
    ) {
        this.isReadyPromise = mongoose.connect(this.configurationService.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})
        this.isReadyPromise.then(() => {
            console.log('mongo connected')
        })
    }
}
