# Supreme web framework

Supreme web framework is a simple general purpose framework which build
witch build around dependency injection pattern. <br/>

The heart of this framework is a ServiceContainer - class that registers
modules and runs them. <br/>

### Example:

```typescript
// server.ts

class Logger {
    static serviceName = 'Logger'
    log = (...args) => {
        console.log(...args)
    }
}

class MyService {
    static serviceName = 'MyService'
    static dependencies = ['Logger']
    constructor(
        private logger: Logger,
    ) {}
    start = () => {
        this.logger.log('Hello world!')
    }
}

const container = new ServiceContainer()
container.registerSingleton(MyService)
container.registerSingleton(Logger)
container.buildSingletons()
container.startSingletons()
```
