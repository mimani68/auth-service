import {
    profile,
    IProfile
} from "../models"
import {
    auth
} from '../libs/auth.class'


export let login = async (req: any, res: any) => {
    // 
    // P R O F I L E
    // D A T A B A S E
    // 
    if (
        !req ||
        !req.body ||
        !req.body.username ||
        !req.body.password
    ) {
        console.error('[AUTH] login failed')
        return res.status(400).json({ 
            error: true,
            request: req.body,
            message: "USERNAME and PASSWORD is unavailable", 
        })
    }

    // 
    // E X P R E S S
    // V A L I D A T O R
    // 
    req.checkBody("username", "Invalid username").notEmpty()
    req.checkBody("password", "Invalid password").notEmpty()
    let errors = req.validationErrors()
    if (errors) throw errors


    // 
    // C H E C K
    // P R O F I L E
    // D A T A B A S E
    // 
    let value: {
        username: string,
        password: string,
        exp: string,
    } = req.body
    console.log('[auth] login `value`', value)
    let users: Array<IProfile> = []
    let selected_user: IProfile
    try {
        users = await profile.getAllProfile({
            username: value.username
        })
        selected_user = users.filter( (o: IProfile) => o.password === value.password )[0]
        return res.status(200).json(auth.genToken({
            username: selected_user.username,
            password: selected_user.password
        }))
    } catch (error) {
        console.error('[AUTH] login failed')
        console.error( error )
        return res.status(401).json({ 
            error: true,
            message: "Invalid credentials", 
            errors: error
        })
    }

}

export let logout = async (req: any, res: any) => {
    return null
}

export let whoami = async (req: any, res: any) => {
    return null
}