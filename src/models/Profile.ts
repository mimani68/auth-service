
import { BaseRepository } from "./repository";
import * as bcrypt from 'bcrypt-nodejs';

export interface IProfile {
    _id?: any;
    username: any;
    password: any;
    role: any;
    description: any;
    email: any;
    phone: any;
    validation_code: any;
    status: any;
}

class Profile extends BaseRepository<any> {

    public DB_SCHEMA: IProfile = {
        username: {
            type: String,
            required: [true, 'user is necessary']
            
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: [String],
            required: false
        },
        description: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        phone: {
            type: String,
            required: false
        },
        validation_code: {
            type: String,
            required: false
        },
        status: {
            type: String,
            required: false
        }
    };

    public model: IProfile;

    constructor(
        _id?: any,
        username?: any,
        password?: any,
        role?: any,
        email?: any,
        phone?: any,
        description?: any,
        validation_code?: any,
        status?: any
        ) {
        super( 'Profile' );
        this.model = {
            _id: _id || null,
            username: username || null,
            password: password || null,
            role: role || null,
            email: email || null,
            phone: phone || null,
            description: description || null,
            validation_code: validation_code || null,
            status: status || null,
        }
        // console.log(`[Profile][debug] run Profile class`);
        this.modelInitialDefinition();
        this.staticMethods();
    }

    private modelInitialDefinition() {
        // console.log(`[Profile][debug] define Profile Model`);
        this.defineModel( this.DB_SCHEMA );
    }

    private staticMethods() {
        const SALT_LENGHT = 8;

        // =========================================
        // generate hash password ==================
        // =========================================
        this.SCHEMA.methods.generateHash = function(password: string) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync( SALT_LENGHT ));
        };
        
        // =========================================
        // compare password ========================
        // =========================================
        this.SCHEMA.methods.validPassword = function( password: string ) {
            return bcrypt.compareSync(password, this.local.password);
        }
    }

    // public async getAllProfile (query?: any): Promise<Array<Profile>> {
    public async getAllProfile (query?: any): Promise<Array<IProfile> | any> {
        return await this.find(query);
    }
    
    public async getSingleProfile ( profile_id: string ): Promise<IProfile> {
        return await this.findOne({ id: profile_id });
    }

    public async createNewProfile<T>( data: IProfile )  {
        return await this.create( data );
    }
    
    public async updateProfile( profile_id: string, data: any ) {
        return await this.update( profile_id, data );
    }

    public async deleteProfile( profile_id: string ) {
        return await this.delete( profile_id )
    }

    public async archiveProfile( profile_id:  string ) {
        return await this.archive( profile_id )
    }

    public async comparePassword( password: string ) {
        return await this.SCHEMA.methods.validPassword( password )
    }
}

export let profile = new Profile();
