import dotenv from 'dotenv'
dotenv.config()

export class ConfigurationService {
    static serviceName = 'ConfigurationService'
    GW_PORT = process.env.GW_PORT || 8080
    STATIC_PORT = process.env.STATIC_PORT || 8081
    JAVA_SERVICE_URL = process.env.JAVA_SERVICE_URL
    MICROSERVICES_RESPONSE_TIMEOUT_MS = process.env.MICROSERVICES_RESPONSE_TIMEOUT_MS || 10000
    MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
    GLOBAL_MWS = ['AuthenticationMiddleware']
    SECRET = process.env.SECRET_KEY || 'secret supreme 123 !!!'

    ROUTE_CONFIG = {
        '^/login$': [[], 'LoginController@login'],
        '^/register$': [[], 'RegisterController@register'],
        '^/profile': [['AuthenticationIsRequiredMiddleware'], 'IndexController@profile'],
        '^/users': [['AuthenticationIsRequiredMiddleware'], 'UsersController@users'],
        '^/api/test$': [[], 'IndexController@index'],
        '^/java/ping$': [[], 'IndexController@javaPing'],
        '^/java/getUser$': [[], 'IndexController@getUser'],
        '^/java/proxy$': [[], 'IndexController@javaProxy'],
        '^/java/proxy-auth$': [[], 'IndexController@javaProxy'],
    }
}
