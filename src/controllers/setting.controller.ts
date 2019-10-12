
import * as express from 'express';
import {
    ISetting,
    setting,
    IServer,
    server,
    responseStandard
} from '../models';

export var findAllSettingData = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // D A T A B A S E
        // Q U E R Y 
        const temp: any = await setting.getAllSetting();

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'هیچ تنظیماتی با مشخصات درخواست شما تطابق ندارد');
            res.status(404).json( result.fetch() );
        }
    }

export var findSingleSetting = async (
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
            result.setError(1, 'ای دی تنظیمات مورد نظر توسط شما ارسال نشد');
            return res.status(422).json( result.fetch() );
        }

        // D A T A B A S E
        // Q U E R Y 
        const temp = await setting.getSingleSetting( req.param('id') );

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.errors ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'هیچ تنظیماتی با مشخصات درخواست شما تطابق ندارد');
            res.status(404).json( result.fetch() );
        }
    }

export var createNewSettingByServerId = async (
    req: express.Request,
    res: express.Response
    ) => {
        // S E T
        // S T A N D A R D
        // R E S P O N S E
        var result = new responseStandard()

        // V A L I D A T E
        // P A R A M E T E R
        if (
            !req.param('id')
        ) {
            result.setError(1, 'ای دی تنظیمات مورد نظر توسط شما ارسال نشد');
            return res.status(400).json( result.fetch() );
        }

        // V A L I D A T E
        // R E Q U E S T
        if (
            !req.body
        ) {
            result.setError(1, 'اطلاعات شما برای ثبت تنظیمات جدید ناقص است');
            return res.status(422).json( result.fetch() );
        }
    
        var arr = [
            'tolerance_days',
            'tolerance_visits'
        ];

        // U P D A T E
        // S E R V E R
        // C H A N G E
        for ( var i = 0 ; i < arr.length ; i++ ) {
            for ( var k in req.body ) {
                if ( k === arr[i] ) {
                    // console.log(`[setting.controller] createNewSettingByServerId() `,{ [k]: req.body[k] })
                    const e = await server.updateServer( req.param('id'), { [k]: +req.body[k] } );
                    console.log(`[setting.controller] createNewSettingByServerId() after update`,e)
                }
            }
        }

        // U P D A T E
        // S E R V E R
        // M E S S A G E
        await server.updateServer( req.param('id'), { config: JSON.stringify(req.body) } );

        // D A T A B A S E
        // Q U E R Y 
        const valueToSave = {
            server: req.param('id'),
            body: JSON.stringify(req.body)
        }
        const temp: any = await setting.saveNewSetting( valueToSave )

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.errors ) {
            result.setData( temp );
            res.status(201).json( result.fetch() );
        } else {
            result.setError(1, 'تنظیمات مورد نظر ساخته نشد');
            res.status(422).json( result.fetch() );
        }
    }

export var updateSettingDetails = async (
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
            !req.body.server &&
            !req.body.body
        ) {
            result.setError(1, 'اطلاعات شما برای بروز رسانی تنظیمات ناقص است');
            return res.status(422).json( result.fetch() );
        }

        // D A T A B A S E
        // Q U E R Y
        const temp = await setting.updateSetting( req.param('id'), req.body )

        // E R R O R
        // H A N D E L I N G
        if ( temp && !temp.error ) {
            result.setData( temp );
            res.status(200).json( result.fetch() );
        } else {
            result.setError(1, 'تنظیمات مورد نظر بروزرسانی نشد');
            res.status(404).json( result.fetch() );
        }
    }
