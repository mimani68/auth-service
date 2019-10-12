import * as express from 'express';

import {
    login,
    logout,
    token,
    whoami
} from '../controllers/auth.controller';

export var AuthRouter = express.Router();

AuthRouter.get('/ping', ( req: express.Request, res:express.Response ) => {
    res.json({
        title: 'pong from Auth routes!',
        time: new Date().toISOString()
    })
});

//
// M A I N
// R O U T E S
//
AuthRouter
    .get('/me', whoami )
    .post('/login', login )
    .post('/token', token )
    .post('/logout', logout );


