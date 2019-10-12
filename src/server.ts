import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as session from 'express-session'
// import * as logger from 'morgan'
import * as helmet from 'helmet'
import { RPCServerProvider } from './libs/amqp_adaptor/rpcserver.rabbitmq.class'
import * as cors from 'cors'
import * as cookieParser from 'cookie-parser'
import { DataBaseConnection } from './config/database'
import { isUserExists } from './controllers/profile.controller';
import {  AuthRouter } from './routes'
import { auth } from './libs/auth.class'

class Server {

    public app : express.Application
    private ALTERNATIVE_SALT = 'Cot$sOR8W1:22d'
    private SESSION_SETTING = {
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || this.ALTERNATIVE_SALT,
    }
    private CORS_OPTIONS = {
        // origin: 'http://example.com',
        // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
    }
    private MONGODB_URL = process.env.DB_CONNECTION_TYPE + '://'
        + process.env.DB_USERNAME + ':'
        + process.env.DB_PASSWORD + '@'
        + process.env.DB_URL + ':'
        + process.env.DB_PORT + '/'
        + process.env.DB_DATABASE 

    constructor() {
        this.app = express.default()
        this.config()
        this.APIRoutes()
        this.rabbitMqServer();
    }

    /**
     * total project configuration
     */
    config() : void {
        // new DataBaseConnection('mongodb', this.MONGODB_URL)

        this.app.use(bodyParser.urlencoded({extended : true}))
        this.app.use(bodyParser.json())
        this.app.use(cookieParser.default())

        this.app.set('trust proxy', 1)
        this.app.use(session.default(this.SESSION_SETTING))

        // this.app.use(logger.default('combined',  {
        //     stream: createWriteStream('./logs/system.log', {flags: 'a'})
        // }))

        this.app.use(cors.default(this.CORS_OPTIONS))

        //
        // A U T H
        // C L A S S
        //
        auth.initialize( this.app )

        //
        // S E C U R I T Y
        // 
        this.app.use(helmet.default())
        // this.app.use(flash())
        // this.app.use(lusca.xframe("SAMEORIGIN"))
        // this.app.use(lusca.xssProtection(true))
    }

    /**
     * 
     */
    async rabbitMqServer() {
        RPCServerProvider.SingleQueueRPCserver('system.core.auth.login', isUserExists)
    }

    APIRoutes(): void {
        // 
        // P U B L I C
        // E N D P O I N T
        // 
        this.app.get(['/ping', '/', '/test', '/help'], (req: any, res: any)=>{
            res.json({
                message: 'pong',
                server: 'authentication server',
                framework: 'express typescript',
                version: '1.0.1',
                test: true,
                time: new Date().toISOString(),
            })
        })

        // 
        // P R O T E C T E D
        // E N D P O I N T
        // 
        this.app.use('/auth', AuthRouter)

    }

}

export default new Server().app
