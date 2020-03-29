export class EventsService {
    static serviceName = 'EventsService'
    private registeredEvents: any = {}
    constructor() {}

    on = (type: string, handler: any) => {
        this.registeredEvents[type] = [...(this.registeredEvents[type] || []), handler]

        return () => {
            this.registeredEvents[type] = (this.registeredEvents[type] || []).filter((h: any) => h !== handler)
        }
    }

    fire = (type: string, payload: any) => {
        (this.registeredEvents[type] || []).forEach((handler: any) => {
            handler(payload)
        })
    }

    once = (eventName: string, handler: any) => {
        const unsubscribeFunction = this.on(eventName, (data: any) => {
            handler(data)
            unsubscribeFunction()
        })
        return unsubscribeFunction
    }

}
