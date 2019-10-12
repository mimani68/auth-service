import * as jwt from "jwt-simple"
import {
    initialize,
    use,
    authenticate,
    session,
    serializeUser,
    deserializeUser
} from "passport"
import {
    Strategy as JWTStrategy,
    ExtractJwt
} from "passport-jwt"
import {
    Strategy as localStartegy,
    IStrategyOptions
} from "passport-local"
import {
    profile,
    IProfile
} from "../models"

class Auth {

    private ALTERNATE_SALT = 'c2d9w2*h&x2?K#N01s'

    public initialize = ( app: any ) => {
        //
        // P A S S P O R T
        // D E B U G
        //
        app.use(initialize())
        app.use(session())

        // 
        // S T R A T E G Y
        // 
        use("jwt", this.JWTStrategy())
        // use("local", this.locaStrategy())

        serializeUser(function(user: any, done: any) {
            done(null, user.id)
        })
        deserializeUser(function(id: string, done: any) {
            let e = profile.getSingleProfile(id)
            if ( e ) done(null, e)
        })

        // return initialize()
    }

    public authenticate = (callback?: any) => {
        authenticate("jwt", { session: false, failWithError: true }, callback)
        // authenticate('local')
    }

    public genToken = (profile: {
        username: string,
        password?: string
    }): {
        token: string,
        exp: string
    } => {
        let expires = new Date( new Date().getTime() + 7 * 24 * 60 * 60 * 1000 ).toISOString()
        let token = jwt.encode({
            exp: expires,
            username: profile.username,
            password: ';('
            // password: profile.password
        }, process.env.JWT_SECRET || this.ALTERNATE_SALT )

        return {
            token: "JWT " + token,
            exp: expires,
        }
    }

    /**
     * 
     * 
     * 
     */
    private locaStrategy = (): localStartegy => {
        const params: IStrategyOptions = {}
        return new localStartegy(
            params,
            (username: string, password: string, done: Function) => {
            //   profile.findOne({
            //       username: username
            //     }, function (err: any, profile: any) {
            //     if (err) { return done(err) }
            //     if (!profile) {
            //       return done(null, false, { message: 'Incorrect username.' })
            //     }
            //     if (!profile.validPassword(password)) {
            //     return done(null, false, { message: 'Incorrect password.' })
            //     }
            //     return done(null, profile)
            //   })
                return done(null, {
                    _id: '154',
                    username: 'mahdi'
                })
            }
        )
    }

    private JWTStrategy = (): JWTStrategy => {
        const params = {
            secretOrKey: process.env.JWT_SECRET || this.ALTERNATE_SALT ,
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            passReqToCallback: true
        }

        return new JWTStrategy(params, (req: any, payload: any, done: any) => {
            // profile.findOne({ 
            //     username: payload.username
            // }, (err: any, profile: any) => {
            //     /* istanbul ignore next: passport response */
            //     if (err) {
            //         return done(err)
            //     }
            //     /* istanbul ignore next: passport response */
            //     if (profile === null) {
            //         return done(null, false, {
            //             message: "The profile in the token was not found"
            //         })
            //     }

            //     return done(null, {
            //         _id: profile._id,
            //         username: profile.username
            //     })
            // })
            return done(null, {
                _id: '154',
                username: 'mahdi'
            })
        })
    }

    /**
     * M I D D L E W A R E
     * @see https://blog.risingstack.com/node-hero-node-js-authentication-passport-js/
     * 
     */
    public authenticationMiddleware = async (
        req: any,
        res: any,
        next: Function
        ) => {
            // 
            // C H E C K
            // H E A D E R
            // 
            let value: {username: string, password: string, exp: string}
            if (
                req &&
                req.header('Authorization')
            ) {
                // console.log('[auth middleware] header ', req.header('Authorization'))
                const md5payload = req.header('Authorization').split(' ')[1]
                // console.log('[auth middleware] md5payload ', md5payload)
                try {
                    value = jwt.decode(
                        md5payload,
                        process.env.JWT_SECRET || this.ALTERNATE_SALT
                    )
                } catch (error) {
                    console.error('[AUTH] TOKEN is invalid')
                    return res.status(401).json({
                        error: true,
                        status: 401,
                        message: 'ACCESS DENIED',
                        description: 'token is invalid'
                    })
                }
            } else {
                console.error('[AUTH] login failed')
                return res.status(401).json({
                    error: true,
                    status: 401,
                    // message: 'LOGIN HEADER TOKEN UNAVAILABLE OR IS NOT VALID'
                    message: 'ACCESS DENIED',
                    description: 'need send token in header with `JWT ....` format'
                })
            }

            // 
            // C H E C K
            // P R O F I L E
            // D A T A B A S E
            // 
            let users: Array<IProfile> = []
            let selected_user: IProfile
            try {
                users = await profile.getAllProfile({
                    username: value.username
                })
                selected_user = users.filter( (o: IProfile) => o.password === value.password )[0]
            } catch (error) {
                console.error('[AUTH] login failed')
                console.error( error )
                return res.status(500).json({
                    error: true,
                    status: 500,
                    message: 'FALIED FIND USER IN DATABASE'
                })
            }

            // 
            // C H E C K
            // H E A D E R
            // 
            if ( !req.header('Authorization') ) {
                console.error('[AUTH] login failed')
                return res.status(401).json({
                    error: true,
                    status: 401,
                    message: 'UNAUTHORIZED ACCESS'
                })
            }

            // 
            // C H E C K
            // E X P I R E
            // T O K E N
            // 
            if ( new Date(value.exp) <= new Date() ) {
                return res.status(500).json({
                    error: true,
                    status: 500,
                    message: 'EXPIRE TOKEN'
                })
            }

            // 
            // C H E C K
            // U S E R
            // 
            if (
                value.username &&
                value.password &&
                new Date(value.exp) >= new Date() &&
                Object.keys(selected_user).length > 0
            ) {
                req.user = selected_user
                req.isAuthenticated = true
                console.log('[AUTH] "' + req.user.username + '" successfull login')
                return next()
            } else {
                console.log('[AUTH] login failed')
                return res.status(500).json({
                    error: true,
                    status: 500,
                    message: 'UNAUTHORIZED ACCESS'
                })
                // throw new Error("UNAUTHORIZED ACCESS")
                // res.redirect('/')
                // return 'failed login'
            }
    }


    /**
     * 
     * M I D D L E W A R E
     * 
     * user availble
     * 
     */
    public findUserMiddleware= async (
        req: any,
        res: any,
        next: Function
        ) => { 
        let value: {username: string, password: string, exp: string}
        let users: Array<IProfile> = []
        if (
            req &&
            req.header('Authorization')
        ) {
            // console.log('[auth middleware] header ', req.header('Authorization'))
            const md5payload = req.header('Authorization').split(' ')[1]
            try {
                value = jwt.decode(
                    md5payload,
                    process.env.JWT_SECRET || this.ALTERNATE_SALT
                )
                users = await profile.getAllProfile({
                    username: value.username
                })
                req.user = users.filter( (o: IProfile) => o.password === value.password )[0]
            } catch (error) {
                console.error('[AUTH] token is invalid')
                console.error('[AUTH] ', md5payload)
            }
        }
        next()

    }


    /**
     * 
     * M I D D L E W A R E
     * 
     * only admin has access
     * 
     */
    public isAdminMiddleware = async (
        req: any,
        res: any,
        next: Function
        ) => {
        // 
        // C H E C K
        // H E A D E R
        // 
        if (
            req &&
            req.user &&
            req.user.role === 'admin'
        ) {
            next()
        }
        
        console.error('[AUTH] login failed')
        res.status(401).json({
            error: true,
            status: 401,
            message: 'ACCESS DENIED',
            description: 'you need access level for this source',
        })
    }

}

export let auth = new Auth()