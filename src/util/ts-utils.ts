export const nameOf = <T>(name: keyof T) => name;

export function getCleanObject<T extends object>(obj: T) {
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === null) {
            delete obj[key]
        }
    });
}

// export function parseHttpRequests<T extends number | string>(req_param: string | string[] | undefined, param_type: 'string' | 'integer'): T[] | undefined {
//     let parsed_param: T[] | undefined = undefined;
//     if (req_param === undefined) return parsed_param;

//     if (param_type === "string") {
       
//     } else if (param_type === 'integer') {

//     }
// }