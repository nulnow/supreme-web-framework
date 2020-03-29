import {UsersService} from '../services/UsersService'

export class UsersController {
    static serviceName = 'UsersController'
    static dependencies = ['UsersService']
    constructor(
        private usersService: UsersService,
    ) {}
}
