
import * as express from 'express';
import {
    server,
    IServer,
    responseStandard
} from '../models';
import { BaseRepository } from '../models/repository';

export var findAllServerData = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // D A T A B A S E
    // Q U E R Y 
    const temp: any = await server.getAllServer()

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp );
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ سروری با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
}

export var findSingleServer = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.param('id')
    ) {
        result.setError(1, 'ای دی سرور مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y 
    const temp = await server.getSingleServer( req.param('id') )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp );
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ سروری با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
 
}

export var createNewServer = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()


    // M O C K
    // D A T A
    // {
    //     "url": "http://aseman.areo",
    //     "crm_ref": "http://12.352.12.10:1520/crm/user/4321",
    //     "bundle": null,
    //     "expireAt": "2018-10-23T12:32:10.000z",
    //     "resHits": "5000",
    //     "extraTime": "100",
    //     "extraHits": "1000",
    //     "license": ObjectId("5bc73a1e49059c9f35615f79"),
    //     "private_key": null,
    //     "public_key": null,
    //     "client_public_key": null,
    //     "status": "active"
    // }

    // C H E C K
    // C U R L
    // curl -X POST -H "Content-Type: application/json" -d '{"ip":"1398.25.10.10","company":"ircu-ul"}' http://localhost:3001/server

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.body.url
    ) {
        result.setError(1, 'اطلاعات شما برای ثبت سرور جدید ناقص است')
        return res.status(422).json( result.fetch() )
    }

    // 
    // L I C E N S E S
    // I D
    // V A L I D A T I O N
    // 
    // if (
    //     !BaseRepository.checkMongoDBId( req.body.license )
    // ) {
    //     result.setError(1, 'ای دی لایسنس مورد اشتباه می باشد')
    //     return res.status(422).json( result.fetch() )
    // }

    // 
    // B U N D L E
    // I D
    // V A L I D A T I O N
    // 
    // if (
    //     req.body.bundle &&
    //     !BaseRepository.checkMongoDBId( req.body.bundle )
    // ) {
    //     result.setError(1, 'ای دی بسته ارسال شما معتبر نیست')
    //     return res.status(422).json( result.fetch() )
    // }

    // D A T A B A S E
    // Q U E R Y 
    const valueToSave: IServer = req.body
    let temp: any;
    try {
        temp = await server.saveNewServer( valueToSave )
    } catch (error) {
        
    }

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp );
        res.status(201).json( result.fetch() )
    } else {
        result.setError(1, 'سرور مورد نظر ساخته نشد')
        res.status(422).json( result.fetch() )
    }

}

export var updateServerDetails = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()


    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.body.title &&
        !req.body.url &&
        !req.body.ip &&
        !req.body.status 
    ) {
        result.setError(1, 'اطلاعات شما برای بروز رسانی سرور ناقص است')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await server.updateServer( req.param('id'), req.body )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp );
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'سرور مورد نظر بروزرسانی نشد')
        res.status(404).json( result.fetch() )
    }

}

export var archiveServerById = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.param('id')
    ) {
        result.setError(1, 'ای دی سرور مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await server.archiveServer( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp );
        res.status(200).json( result.fetch() );
    } else {
        result.setError(1, 'سرور مورد نظر یافت نشد');
        res.status(404).json( result.fetch() );
    }
}

export var deleteServerById = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.param('id')
    ) {
        result.setError(1, 'ای دی سرور مورد نظر توسط شما ارسال نشد');
        return res.status(422).json( result.fetch() );
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await server.deleteServer( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp );
        res.status(200).json( result.fetch() );
    } else {
        result.setError(1, 'سرور مورد نظر یافت نشد');
        res.status(404).json( result.fetch() );
    }
}
