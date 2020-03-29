export const controllerTemplate = (name: string) => {
    return `
export class ${name} {
    static serviceName: string = '${name}'
    static dependencies: string[] = []
    
    index = async (request: any) => {
        return {
            code: 200,
            data: 'test',
        }
    }
    
}
`
}
