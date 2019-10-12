
import { BaseRepository } from "./repository";

export interface IAuditLog {
    _id?: any;
    request: any;
    path: any;
    url: any;
    params: any;
    query: any;
    time: any;
    ip: any;
    user: any;
    token: any;
    header: any;
    x_forward: any;
}

class AuditLog extends BaseRepository<any> {

    public DB_SCHEMA: IAuditLog = {
        _id: {
            type: String,
            required: false
        },
        header: {
            type: {},
            required: false
        },
        ip: {
            type: String,
            required: true
        },
        params: {
            type: {},
            required: false
        },
        path: {
            type: String,
            required: false
        },
        query: {
            type: {},
            required: false
        },
        request: {
            type: {},
            required: false
        },
        time: {
            type: String,
            required: false
        },
        token: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
        },
        user: {
            type: {},
            required: false
        },
        x_forward: {
            type: String,
            required: false
        }
    };

    public model: IAuditLog;

    constructor(
        _id?: any,
        request?: any,
        path?: string,
        url?: string,
        params?: object,
        query?: object,
        time?: string,
        ip?: string,
        user?: object,
        token?: string,
        header?: any,
        x_forward?: string,
        ) {
        super( 'AuditLog' );
        this.model = {
            _id: _id || null,
            request: request || null,
            path: path || null,
            url: url || null,
            params: params || null,
            query: query || null,
            time: time || null,
            ip: ip || null,
            user: user || null,
            token: token || null,
            header: header || null,
            x_forward: x_forward || null,
        }
        this.modelInitialDefinition();
        this.staticMethods();
    }

    private modelInitialDefinition() {
        this.defineModel( this.DB_SCHEMA );
    }

    private staticMethods() {
        // const SALT_LENGHT = 8;

        // this.SCHEMA.methods.generateHash = function(password: string) {
        //     return bcrypt.hashSync(password, bcrypt.genSaltSync( SALT_LENGHT ));
        // };
    }

    public async getAllAuditLog (query?: any): Promise<Array<IAuditLog> | any> {
        return await this.find(query);
    }
    
    public async getSingleAuditLog ( auditLog_id: string ): Promise<IAuditLog> {
        return await this.findOne({ id: auditLog_id });
    }

    public async createNewAuditLog<T>( data: IAuditLog )  {
        return await this.create( data );
    }
    
    public async updateAuditLog( auditLog_id: string, data: any ) {
        return await this.update( auditLog_id, data );
    }

    public async deleteAuditLog( auditLog_id: string ) {
        return await this.delete( auditLog_id )
    }

    public async archiveAuditLog( auditLog_id:  string ) {
        return await this.archive( auditLog_id )
    }

    public async comparePassword( password: string ) {
        return await this.SCHEMA.methods.validPassword( password )
    }
}

export let auditLog = new AuditLog();
