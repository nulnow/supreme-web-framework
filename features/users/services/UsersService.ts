import {ModelsService} from '../../../services/ModelsService'

export class UsersService {
    static serviceName = 'UsersService'
    static dependencies = ['ModelsService']

    constructor(
        private modelsService: ModelsService,
    ) {
        // setTimeout(() => {
        //     (new this.modelsService.UserModel({
        //         name: 'test',
        //         password: 'kek',
        //     })).save()
        // }, 4000)
    }

    getById = async (userId: string) => {
        return this.modelsService.UserModel.findById(userId)
    }

    getByEmail = async (email: string) => {
        console.log('getByEmail ' + email)
        return await this.modelsService.UserModel.findOne({ email }).exec()
    }

    list = async () => {
        return await this.modelsService.UserModel.find({}).exec()
    }

    addUser = async (user: any) => {
        const newUser = new this.modelsService.UserModel(user)
        await newUser.save()
        return newUser
    }

}
