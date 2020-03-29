export const middlewareTemplate = (name: string) => {
    return `
export class ${name} {
    static serviceName: string = '${name}'
    static dependencies: string[] = []
    
    run = async (request: any) => {
        // todo
    }
    
}
`
}
