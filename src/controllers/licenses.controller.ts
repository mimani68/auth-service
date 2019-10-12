
import * as express from 'express';
import {
    ILicense,
    license,
    responseStandard
} from '../models';
import { BaseRepository } from '../models/repository';

export var findAllLicenseData = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // D A T A B A S E
    // Q U E R Y 
    const temp: any = await license.getAllLicense()

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ لایسنسی با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
}

export var findSingleLicense = async (
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
        result.setError(1, 'ای دی لایسنس مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // V A L I D A T E
    // I D 
    // I S  V A L I D
    if (
        !BaseRepository.checkMongoDBId( req.param('id') )
    ) {
        result.setError(1, 'ای دی لایسنس مورد اشتباه می باشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y 
    const temp = await license.getSingleLicense( req.param('id') )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'هیچ لایسنسی با مشخصات درخواست شما تطابق ندارد')
        res.status(404).json( result.fetch() )
    }
 
}


export var createNewLicense = async (
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
    //     "_id" : ObjectId("5bc73a1e49059c9f35615f79"),
    //     "license" : "123",
    //     "description" : "nadarad",
    //     "status" : "active",
    //     "createdAt" : "13970725"
    // }

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.param('server_id') ||
        !BaseRepository.checkMongoDBId( req.param('server_id') )
    ) {
        result.setError(1, 'سرور مورد نظر جهت الصاق لایسنس مشخص شود')
        return res.status(422).json( result.fetch() )
    }

    // V A L I D A T E
    // R E Q U E S T
    // if (
    //     !req.body.status
    // ) {
    //     result.setError(1, 'وضعیت لایسنس را مشخص کنید')
    //     return res.status(422).json( result.fetch() )
    // }

    // D A T A B A S E
    // Q U E R Y 
    // const valueToSave: ILicense = req.body
    const temp: any = await license.generateNewLicense( req.param('server_id') )

    // C H E C K
    // C U R L
    // curl -X POST -H "Content-Type: application/json" -d '{"ip":"1398.25.10.10","company":"ircu-ul"}' http://localhost:3001/license

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.errors ) {
        result.setData( temp )
        res.status(201).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر ساخته نشد')
        res.status(422).json( result.fetch() )
    }

}

export var updateLicenseDetails = async (
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
        result.setError(1, 'اطلاعات شما برای بروز رسانی لایسنس ناقص است')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await license.updateLicense( req.param('id'), req.body )

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر بروزرسانی نشد')
        res.status(404).json( result.fetch() )
    }

}

export var archiveLicenseById = async (
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
        result.setError(1, 'ای دی لایسنس مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // V A L I D A T E
    // I D 
    // I S  V A L I D
    if (
        !BaseRepository.checkMongoDBId( req.param('id') )
    ) {
        result.setError(1, 'ای دی لایسنس مورد اشتباه می باشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await license.archiveLicense( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}

export var deleteLicenseById = async (
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
        result.setError(1, 'ای دی لایسنس مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // V A L I D A T E
    // I D 
    // I S  V A L I D
    if (
        !BaseRepository.checkMongoDBId( req.param('id') )
    ) {
        result.setError(1, 'ای دی لایسنس مورد اشتباه می باشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await license.deleteLicense( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}

export var deactiveLicense = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // V A L I D A T E
    // I D 
    // E X I S T
    if (
        !req.param('id')
    ) {
        result.setError(1, 'ای دی لایسنس مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // V A L I D A T E
    // I D 
    // I S  V A L I D
    if (
        !BaseRepository.checkMongoDBId( req.param('id') )
    ) {
        result.setError(1, 'ای دی لایسنس مورد اشتباه می باشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await license.deactiveLicense( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}

export var activeLicense = async (
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
        result.setError(1, 'ای دی لایسنس مورد نظر توسط شما ارسال نشد')
        return res.status(422).json( result.fetch() )
    }

    // D A T A B A S E
    // Q U E R Y
    const temp = await license.activeLicense( req.param('id') )
    
    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'لایسنس مورد نظر یافت نشد')
        res.status(404).json( result.fetch() )
    }
}
