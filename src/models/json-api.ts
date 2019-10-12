
export class JSON_API {

    private result: IJSON_API = {
        "jsonapi": {
            version: "1.0"
        }
    };

    private request: any;

    constructor( req: any ) {
        this.request = req;
        this.setTime();
        this.setLinks();
    }

    setError(
        title: string,
        code: string,
        status: string,
        meta: any,
    ): void {
        this.result.error = { title, code, status, meta };
    }

    setData( data: any ): any {
        this.result.data = data;
    }

    setMetaData(): any {

    }

    setLinks() {
        this.result.links = {
            self: {
                href: this.request.headers.host + this.request.originalUrl
            }
        }
    }

    setTime() {
        this.result.meta = {
            timeStamp: Date.now()
        }
    }

    public fetch() {
        return this.result;
    }
}


interface IJSON_API {
    jsonapi?: any;
    error?: IError;
    data?: any;
    links?: Ilinks;
    relations?: any;
    included?: any;
    meta?: any;
}

interface IError {
    id?: number,
    links?: Ilinks;
    status?: string;
    title?: string;
    code?: string;
    source?: IErrorSourceDetails;
    meta?: any
}

interface IErrorSourceDetails {
    pointer?: string;
    parameter?: string;
}

interface Ilinks {
    self?: string | IlinksDetails;
    next?: string | IlinksDetails;
    up?: string | IlinksDetails;
    previous?: string | IlinksDetails;
    last?: string | IlinksDetails;
    related?: IRelated;
}

interface IlinksDetails {
    title?:string;
    href?: string;
    meta?: any;
}

interface IRelated {
    href?:string;
    meta?: any;
}
