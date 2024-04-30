

export default class Utils {
    private constructor() {}

    static isProductionBuild() {
        return process.env.NODE_ENV === 'production';
    }

    static present<T>(value: T | undefined | null, callback: (value: T)=>void, notPresentCallback?: ()=>void){
        if(value) callback(value)
        else if(notPresentCallback) notPresentCallback();
    }

    static matches(input: string, regex: RegExp) {
        let matches = [];
        let current: RegExpMatchArray | null;
        while (current = regex.exec(input)) {
            matches.push(current);
        }
        return matches;
    }

    static getEnvNumber(key: string, defaultValue?: number) : number {
        return Number.parseInt(this.getEnv(key, ""+defaultValue))
    }
    static getEnv(key: string, defaultValue?: string): string {
        const value = process.env[key]
        if (value)
            return value;
        else if(defaultValue)
            return defaultValue
        throw new Error(`${key} is not in env variables!`)
    }
}
