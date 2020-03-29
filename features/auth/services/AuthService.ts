import {UsersService} from '../../users/users'
import bcrypt = require('bcrypt')
import jwt = require('jsonwebtoken')
import {ConfigurationService} from '../../../services/ConfigurationService'
import {LoggerService} from '../../../services/LoggerService'

export class AuthService {
    static serviceName = 'AuthService'
    static dependencies = ['UsersService', 'ConfigurationService', 'LoggerService']

    saltRounds = 8

    constructor(
        private usersService: UsersService,
        private configurationService: ConfigurationService,
        private loggerService: LoggerService,
    ) {}

    hashPassword = async (plainPassword: string): Promise<string> => {
        return await bcrypt.hash(plainPassword, this.saltRounds)
    }

    compareHash = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(plainPassword, hashedPassword)
    }

    generateTokenForUser = async (user: any) => {
        this.loggerService.log(`calling generateTokenForUser ${JSON.stringify(user)}`)
        return jwt.sign(user, 'secret')
    }

    verifyToken = async (token: string) => {
        this.loggerService.log(`calling verifyToken ${token}`)
        return jwt.verify(token, 'secret')
    }

    loginUser = async (email: string, password: string): Promise<string|null> => {
        this.loggerService.log(`calling loginUser ${email} ${password}`)
        const user: any = await this.usersService.getByEmail(email)
        if (!user) {
            return null
        }
        if (! await this.compareHash(password, user.password)) {
            return null
        }
        return await this.generateTokenForUser(user.toJSON())
    }

    registerUser = async (user: any): Promise<string|null> => {
        this.loggerService.log(`calling loginUser ${JSON.stringify(user)}`)
        const userInDb: any = await this.usersService.getByEmail(user.email)
        if (userInDb) {
            return null
        }
        const newUser = await this.usersService.addUser({
            ...user,
            password: await this.hashPassword(user.password)
        })
        await newUser.save()
        return await this.generateTokenForUser(newUser.toJSON())
    }

    getUserFromToken = async (token: string) => {
        this.loggerService.log(`calling getUserFromToken ${token}`)
        const verified: any = await this.verifyToken(token)
        if (verified) {
            return this.usersService.getById(verified._id)
        }
        return null
    }
}
