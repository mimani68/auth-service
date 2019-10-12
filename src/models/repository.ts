import { model, Schema, models, Types, Model } from "mongoose";

export abstract class BaseRepository<T> {

    public modelName: any;
    public tempModel: any;
    // public modelObject: Model<any> = new Model({});
    public modelObject: any;
    public SCHEMA: any;

    public farsiCharacterRegex = /[ابپتثجچحخدرزژسشصضطظعغفقکگلمنوهی\s]/;

    constructor( modelName: string ) {
        this.modelName = modelName;
    }

    /**
     * 
     * @param schemalObject 
     * @example { name: String }
     */
    public defineModel( schemalObject: any ) {
        // console.log(`[repository] generate model`, schemalObject, `\n`);
        this.defineSchema( schemalObject )
        try {
            // console.log(`[repository] models.Server`, models['servers'], `\n`);
            this.modelObject = model( this.modelName, this.SCHEMA ) || models[this.modelName];
            // console.log(`[repository] this.modelObject`, this.modelObject, `\n`);
        } catch (error) {
            console.error(`[repository] failed generate model`, error);
        }
    }

    public defineSchema( schemalObject: any ) {
        this.SCHEMA = new Schema(schemalObject, 
            {
                timestamps: {
                    createdAt: 'createdAt',
                    updatedAt: 'updatedAt'
                },
                versionKey: '__v',
            }
        )

        //
        // version incresment
        //
        // let temp = this.SCHEMA;
        // this.SCHEMA.pre('update', function( next: any ) {
        //     temp.SCHEMA.update({}, { $inc: { __v: 1 } }, next );
        // });

        // FIXME:
        this.defineMethods();
        this.defineStaticMethods();
    }
    
    public defineStaticMethods() {
        this.SCHEMA.statics.findByName = function(id: string, cb?: Function) {
            return this.find({ _id: id }, cb);
        };
        this.SCHEMA.statics.archive = async ( entity_id: string ) => {
            console.log(`[repository] archive()`, entity_id);
            return await this.modelObject.find({ _id: entity_id });
            // return this.update({ _id: entity_id }, {status: 'archive'});
        }
    }

    public defineMethods() {
        this.SCHEMA.methods.test = async ( entity_id: string ) => {
            console.log(`[repository] defineMethods() test()`, entity_id);
            return await { name: 'salam' };
            // return await this.model.find({ _id: entity_id });
            // return await this.model.update({ _id: entity_id }, {status: 'archive'});
        }
    }

    /**
     * 
     * @example find(query, 10, 'user', 'price', 'memebership')
     */
    public async find<T>( query?: any | null, perPage?: number | null, ...populate: any ) {
        if ( query && perPage === null ) {
            return await this.modelObject.find(query)
            .populate(populate);
            // .limit(perPage)
            // .skip(perPage * page)
            // .sort({
            //     name: 'asc'
            // })
        } else if ( perPage ) {
            return await this.modelObject.find( query )
                .populate(populate)
                .limit(perPage);
        } else {
            return await this.modelObject.find()
                .populate(populate);
        }
    }
    
    /**
     * 
     * @param query 
     * @param populate 
     * 
     * @example findOne(query, 'bundle', 'price', 'memebership')
     */
    public async findOne<T>( query?: any, ...populate: any ) {
        // console.log(`[repository] findOne() arg`, query)
        if ( query ) {
            return await this.modelObject.findOne(query)
                .populate(populate);
        } else {
            console.log('[repository] failed finedOne');
            return {
                error: 'failed finedOne'
            };
        }
    }
            
    public async create<T>( valueToAdd: T ) {
        if ( valueToAdd ) {
            try {
                return await this.modelObject.create(valueToAdd);
            } catch (error) {
                console.log('[repository] failed create');
                console.log(error);
                return error;
            }
        } else {

        }
    }

    public async creatEach( valueToAdd: T ) {

    }

    public async update( id: number | string, data: any) {
        const query = { _id: id };
        try {
            //
            // version 1
            //
            // await this.modelObject.update(query, data)
            // return await this.modelObject.findOne(query)

            //
            // version 2
            //
            return await this.modelObject.findOneAndUpdate(query, data, {
                maxTimeMS: 3000,     // puts a time limit on the query - requires mongodb >= 2.6.0
            })
        } catch (error) {
            console.log('failed update', error);
            return { error };
        }
    }

    public async delete( id: number | string ) {
        const query = { _id: id };
        try {
            return await this.modelObject.deleteOne(query)
        } catch (error) {
            console.log('failed delete', error);
            return error;
        }
    }

    public async archive( id: number | string ) {
        const query = { _id: id };
        try {
            return await this.modelObject.updateOne(query, {status: 'archive'})
        } catch (error) {
            console.log('failed delete', error);
            return error;
        }
    }


    /**************************************************
     *                                                * 
     *                M O N G O D B                   * 
     *                                                * 
     *************************************************/
    static checkMongoDBId( id: string ): boolean {
        return Types.ObjectId.isValid( id );
    }

    static generateMongoId(): any {
        return Types.ObjectId();
    }

}
