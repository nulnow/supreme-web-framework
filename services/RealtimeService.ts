import {EventsService} from './EventsService'

export class RealtimeService {
    static serviceName = 'RealtimeService'
    static dependencies = ['EventsService']

    private sockets: any = []

    constructor(
        private eventsService: EventsService,
    ) {}

    registerSocket = (socket: any) => {
        this.sockets = [...this.sockets, socket]
    }

    unregisterSocket = (socket: any) => {
        this.sockets = this.sockets.filter((s: any) => s !== socket)
    }

    broadcast = (eventName: string, data: any) => {
        this.sockets.forEach((socket: any) => {
            socket.emit(eventName, data)
        })
    }

    sendToSocketById = (socketId: string, eventName: string, data: any) => {
        const socket: any = this.sockets.find((s: any) => s.id === socketId)
        if (socket) {
            socket.emit(eventName, data)
        }
    }


}
