export class ServiceContainer {
    public serviceClasses: any = {}
    public singletons: any = {}

    registerSingleton = (serviceName: string, serviceClass: any) => {
        this.serviceClasses[serviceName] = serviceClass
    }

    registerService = (service: any) => {
        this.registerSingleton(service.serviceName, service)
    }

    resolveSingleton = (serviceName: string) => {
        if (serviceName === 'ServiceContainer') {
            return this
        }
        if (this.singletons.hasOwnProperty(serviceName)) {
            return this.singletons[serviceName]
        } else {
            const serviceClass = this.serviceClasses[serviceName]
            if (!serviceClass) {
                throw new Error(`Service ${serviceName} is not registered`)
            }
            const dependencies = (serviceClass.dependencies || []).map(this.resolveSingleton)
            const singleton = new serviceClass(...dependencies)
            this.singletons[serviceName] = singleton
            return singleton
        }
    }

    buildSingletons = () => {
        Object.keys(this.serviceClasses).forEach(serviceName => {
            this.resolveSingleton(serviceName)
        })
    }

    startSingletons = () => {
        Object.values(this.singletons).forEach((service: any) => {
            if (typeof service.start === 'function') {
                service.start()
            }
        })
    }
}
