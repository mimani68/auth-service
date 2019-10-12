
export class responseStandard {

    public success?: boolean;
    public result?: Array<any> | any;
    public error?: any;

    constructor() {
    }

    setData( result: any ) {
        this.result = result;
        this.success = true;
    }
    
    setError( code: string | number, message: string ) {
        this.error = {
            code,
            message
        }
        this.success = false;
    }

    fetch() {
        return this;
    }

}