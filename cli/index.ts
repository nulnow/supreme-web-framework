import fs from 'fs'
import path from 'path'
import {serviceTemplate} from './templetes/service-template'
import {controllerTemplate} from './templetes/controller-template'
import {middlewareTemplate} from './templetes/middleware-template'

function getArg(arg: any, def: any) {
    const regexp = RegExp(`--${arg}=(\\w{0,})`)
    return process.argv.find(arg => arg.match(regexp))
        // @ts-ignore
        ? process.argv.find(arg => arg.match(regexp)).split('=')[1] : def
}

const makeFeature = (featureName: string): void => {

    // check if feature is already exist
    if (fs.existsSync(path.resolve(`./features/${featureName}`))) {
        console.error(`${featureName} feature is already exists!`)
        return
    }

    fs.mkdirSync(path.resolve(`./features/${featureName}`))
    fs.mkdirSync(`./features/${featureName}/services`)
    fs.mkdirSync(`./features/${featureName}/controllers`)
    fs.mkdirSync(`./features/${featureName}/models`)
    fs.mkdirSync(`./features/${featureName}/middlewares`)

    makeService(`features/${featureName}/services/${featureName}Service`)
    makeController(`features/${featureName}/controllers/${featureName}Controller`)
    makeMiddleware(`features/${featureName}/middlewares/${featureName}Middleware`)
}

const makeController = (controllerName: string): void => {
    if (controllerName.includes('/')) {
        const controllerPath = controllerName.split('/').slice(0, -1).join('/')
        const controllerFileName = controllerName.split('/').pop() || ''
        if (!fs.existsSync(path.resolve(controllerPath))) {
            fs.mkdirSync(path.resolve(controllerPath), { recursive: true })
        }
        fs.writeFileSync(path.resolve(`${controllerPath}/${controllerFileName}.ts`), controllerTemplate(controllerFileName))
    } else {
        fs.writeFileSync(path.resolve(`${controllerName}.ts`), controllerTemplate(controllerName))
    }
}

const makeService = (serviceName: string): void => {
    if (serviceName.includes('/')) {
        const controllerPath = serviceName.split('/').slice(0, -1).join('/')
        const controllerFileName = serviceName.split('/').pop() || ''
        if (!fs.existsSync(path.resolve(controllerPath))) {
            fs.mkdirSync(path.resolve(controllerPath), { recursive: true })
        }
        fs.writeFileSync(path.resolve(`${controllerPath}/${controllerFileName}.ts`), serviceTemplate(controllerFileName))
    } else {
        fs.writeFileSync(path.resolve(`${serviceName}.ts`), serviceTemplate(serviceName))
    }
}

const makeMiddleware = (middlewareName: string): void => {
    if (middlewareName.includes('/')) {
        const controllerPath = middlewareName.split('/').slice(0, -1).join('/')
        const controllerFileName = middlewareName.split('/').pop() || ''
        if (!fs.existsSync(path.resolve(controllerPath))) {
            fs.mkdirSync(path.resolve(controllerPath), { recursive: true })
        }
        fs.writeFileSync(path.resolve(`${controllerPath}/${controllerFileName}.ts`), middlewareTemplate(controllerFileName))
    } else {
        fs.writeFileSync(path.resolve(`${middlewareName}.ts`), serviceTemplate(middlewareName))
    }
}

const command: string = process.argv[2]

switch (command) {
    case 'make:feature': {
        const featureName = process.argv[3]
        if (!featureName) {
            console.error('Feature name must be provided!')
            break
        }
        makeFeature(featureName)
        break
    }
    case 'make:controller': {
        const controllerName = process.argv[3]
        if (!controllerName) {
            console.error('Controller name must be provided!')
            break
        }
        makeController(controllerName)
        break
    }
    case 'make:middleware': {
        const middlewareName = process.argv[3]
        if (!middlewareName) {
            console.error('Middleware name must be provided!')
            break
        }
        makeMiddleware(middlewareName)
        break
    }
    case 'make:service': {
        const serviceName = process.argv[3]
        if (!serviceName) {
            console.error('Service name must be provided!')
            break
        }
        makeService(serviceName)
        break
    }
    case 'deploy': {
        // TODO
        break
    }
}
