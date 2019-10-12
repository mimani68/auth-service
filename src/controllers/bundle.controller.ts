
import * as express from 'express';
import {
    bundle,
    IBundle,
    responseStandard
} from '../models';
import { BaseRepository } from '../models/repository';
import { server, IServer } from './../models/Server';

export var findAllBundleData = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // D A T A B A S E
    // Q U E R Y 
    const temp: any = await bundle.getAllBundle()

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ بستهی با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
}

export var findSingleBundle = async (
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
        result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y 
    const temp = await bundle.getSingleBundle( req.param('id') )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ بستهی با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
 
}

export var createNewBundle = async (
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

    //
    // D E B U G
    // M O D E
    // 
    //  curl -X POST -d '{"category": "company","description": "sample note goes here","duration": "30", "hit": "10000", "hitPeroid": "30", "start": null, "status": "active","title": "christmas bundle"}' -H "Content-Type:application/json"  http://localhost/bundle | python -m json.tool
    // 


    // V A L I D A T E
    // R E Q U E S T
    // if (
    //     !req.body.url
    // ) {
    //     result.setError(1, 'اطلاعات شما برای ثبت بسته جدید ناقص است')
    //     console.log('[bundle.controller] ERROR');
    //     return res.status(422).json( result.fetch() )
    // }

    // D A T A B A S E
    // Q U E R Y 
    const valueToSave: IBundle = req.body
    console.log('[bundle.controller][DEBUG] new bundle data', valueToSave);
    const temp: any = await bundle.saveNewBundle( valueToSave )

    // C H E C K
    // C U R L
    // curl -X POST -H "Content-Type: application/json" -d '{"ip":"1398.25.10.10","company":"ircu-ul"}' http://localhost:3001/bundle

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp )
        res.status(201).json( result.fetch() )
    } else {
        result.setError(1, 'بسته مورد نظر ساخته نشد')
        res.status(422).json( result.fetch() )
    }

}

export var updateBundleDetails = async (
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
        result.setError(1, 'اطلاعات شما برای بروز رسانی بسته ناقص است')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await bundle.updateBundle( req.param('id'), req.body )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'بسته مورد نظر بروزرسانی نشد')
        res.status(404).json( result.fetch() )
    }

}

export var archiveBundleById = async (
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
        result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await bundle.archiveBundle( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'بسته مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}

export var deleteBundleById = async (
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
        result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await bundle.deleteBundle( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'بسته مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}

export var chargeBundle = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // 
        // V A L I D A T E
        // B U N D L E
        // 
        if (
            !req.param('bundle_id') || 
            !BaseRepository.checkMongoDBId( req.param('bundle_id') )
        ) {
            result.setError(1, 'بسته مورد نظر درست انتخاب نشده است')
            return res.status(400).json( result.fetch() )
        }

        // 
        // V A L I D A T E
        // S E R V E R
        // 
        if (
            !req.param('server_id') || 
            !BaseRepository.checkMongoDBId( req.param('server_id') )
        ) {
            result.setError(1, 'سرور مورد نظر انتخاب نشده است')
            return res.status(400).json( result.fetch() )
        }

        // D A T A B A S E
        // Q U E R Y
        const bundleDto: IBundle = await bundle.getSingleBundle( req.param('bundle_id') )
        let temp: any
        if ( bundleDto && bundleDto._id ) {
            temp = await server.chargeServer( req.param('server_id'), bundleDto )
        }
        
        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp )
            res.status(200).json( result.fetch() )
        } else {
            result.setError(1, 'عملیات شارژ اتفاق نیفتاد')
            res.status(404).json( result.fetch() )
        }
    }    
