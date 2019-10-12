
import * as express from 'express';
import {
    ITrialRequest,
    trialRequest,
    responseStandard
} from '../models';

export var findAllTrialRequestData = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // D A T A B A S E
        // Q U E R Y 
        const temp: any = await trialRequest.getAllTrialRequest();

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'هیچ ترایالی با مشخصات درخواست شما تطابق ندارد');
            res.status(404).json( result.fetch() );
        }
    }

export var findSingleTrialRequest = async (
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
            result.setError(1, 'ای دی ترایال مورد نظر توسط شما ارسال نشد');
            return res.status(422).json( result.fetch() );
        }

        // D A T A B A S E
        // Q U E R Y 
        const temp = await trialRequest.getSingleTrialRequest( req.param('id') );

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.errors ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'هیچ ترایالی با مشخصات درخواست شما تطابق ندارد');
            res.status(404).json( result.fetch() );
        }
    }

export var createNewTrialRequest = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // V A L I D A T E
        // R E Q U E S T
        // @ D E P R E C A T E D
        // if (
        //     !req.body.server &&
        //     !req.body.body
        // ) {
        //     result.setError(1, 'اطلاعات شما برای بروز رسانی ترایال ناقص است');
        //     return res.status(422).json( result.fetch() );
        // }

        // D A T A B A S E
        // Q U E R Y
        // W I T H
        // V A L I D A T I O N
        const temp: void | any = await trialRequest.createNewTrialRequest( req.body )
        console.log(`[trial.controller]`, temp )

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'ترایال مورد نظر ساخته نشد');
            res.status(404).json( result.fetch() );
        }
    }

export var updateTrialRequestDetails = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // V A L I D A T E
        // R E Q U E S T
        // @ D E P R E C A T E D
        // if (
        //     !req.body.server &&
        //     !req.body.body
        // ) {
        //     result.setError(1, 'اطلاعات شما برای بروز رسانی ترایال ناقص است');
        //     return res.status(422).json( result.fetch() );
        // }

        // D A T A B A S E
        // Q U E R Y
        // W I T H
        // V A L I D A T I O N
        const temp = await trialRequest.updateTrialRequest( req.param('id'), req.body )

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'ترایال مورد نظر بروزرسانی نشد');
            res.status(404).json( result.fetch() );
        }
    }


export var deleteTrialRequestById = async (
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
            result.setError(1, 'ای دی ترایال مورد نظر توسط شما ارسال نشد');
            return res.status(422).json( result.fetch() );
        }

        // D A T A B A S E
        // Q U E R Y
        const temp = await trialRequest.deleteTrialRequest( req.param('id') )
        
        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'ترایال مورد نظر یافت نشد');
            res.status(404).json( result.fetch() );
        }
    }
