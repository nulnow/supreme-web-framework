export const serviceTemplate = (name: string) => {
    return `
export class ${name} {
    static serviceName: string = '${name}'
    static dependencies: string[] = []
    
    test = async (request: any) => {
        return 'test'
    }
    
}
`
}
