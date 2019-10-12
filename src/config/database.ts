
export class DataBaseConnection {

    private dataBaseType: string;
    private mongoose: any;

    constructor( dataBaseType?: string, connectionString?: string ) {
        this.dataBaseType = dataBaseType || 'mongodb';
        if ( this.dataBaseType === 'mongodb' ) {
            this.mongoose = require('mongoose');
            this.checkMongoConnections( connectionString );
        }
    }

    public checkMongoConnections( connectionString: string = 'mongodb://mongo:27017/danalica_ls' ) {

        //
        // D E B U G
        //
        // console.log('[debug] ',  connectionString )

        this.mongoose.connect(connectionString);
        this.mongoose.connection.on('connected', () => console.log('MongoDB Connected'));
        this.mongoose.connection.on('open', ( ref: any ) => {
            this.mongoose.connection.db.listCollections().toArray(function ( err: any, names: any ) {
                if (err) {
                    console.log(err);
                } else {
                    // use other places
                    // console.log(`[database] collections list `, names);
                    // module.exports.Collection = names;
                }
            });
        })
        this.mongoose.connection.on('error', ( error: any ) => console.log('Connection failed with - ', error ));
    }

}
