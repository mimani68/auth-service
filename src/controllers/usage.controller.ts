import * as express from 'express'
import { now } from 'jalali-moment'

import {
    server,
    license,
    usage,
    responseStandard,
    setting,
    IUsage,
    bundle
} from '../models'

import {
    createServerKeys,
    decryptRSA,
    encryptRSA
} from './secure.controller'

import {
    danalica
} from '../config/constatnt'

import { BaseRepository } from '../models/repository'


/*************************************
 * 
 *      R E G I S T E R
 * 
 *************************************/
export var registerServer = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.body.license
    ) {
        result.setError(1, 'متن لایسنس ارسال نشد')
        return res.status(400).json( result.fetch() )
    }

    if (
        !req.body.client_public_key
    ) {
        result.setError(1, 'کلید عمومی کاربر به سرور تحویل داده نشد')
        return res.status(400).json( result.fetch() )
    }

    const ls = await license.getSingleLicenseByCode( req.body.license )
    console.log(`[usage.controller] ls["_id"]`, ls["_id"])
    // console.log(`[usage.controller] license.getSingleLicenseByCode`, ls)
    
    if ( ls ) {
        let selected_server = await server.getSingleServerByLicense( ls["_id"] )
        // selected_server = await server.getSingleServerByLicense( "123" )
        console.log(`[usage.controller] license.getSingleServerByLicense`, selected_server)
        if ( !selected_server ) {
            console.log(`[usage.controller] filed load server details`)
            return res.status(404).json({
                message: 'سروری که این لایسنس به آن تعلق داشته باشد وجود ندارد',
                success: false
            })
        }
        

        //
        // U P D A T E
        // C L I E N T
        // P U B L I C  K E Y
        // 
        // selected_server.client_public_key = "-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPMYNrmAVtuQHyQjbvB50NvZha\r\nxYx8CQhWh3Ws8xxHyC/ir3iYq1XbNiuA+H0Ih/tfm1U9HHFtVZkVkFIxedLSF+AJ\r\nt1TwYNULHsnpJV0uUVOt1ofZvYHWcPsyAR09QLblVxKtyGDzQfeKIBhW6dcyxx2F\r\nGfwfRbyahadruoXSkQIDAQAB\r\n-----END PUBLIC KEY-----\r\n"
        selected_server.client_public_key = req.body.client_public_key
        await server.updateServer( selected_server._id, selected_server )
        // console.log(`[usage.controller] server`, selected_server)

        //
        // C R E A T E
        // R S A   P A I R   K E Y S
        // S E R V E R S
        // 
        const key_res: any = await createServerKeys( selected_server._id )
        // console.log(`[usage.controller] server keys`, key_res)

        res.json({
            id: selected_server._id,
            domain_address: selected_server.url,
            public_key: key_res.result.public,
        })
    } else {
        res.status(404).json({
            message: 'لایسنس شما معتبر نیست',
            success: false
        })
    }


}

/*************************************
 * 
 *         U S A G E
 *         R E P O R T
 * 
 *************************************/
export var usageReport = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {

        // 
        // D E B U G
        // 
        // return res.json( req.body )

        // D E F I N E
        // M O D E L
        let model: any = {
            server: req.body.server,
            bundle: req.body.server.bundle,
            createdAt: now().toString()
        }

        // 
        // D E B U G
        // 
        // return res.json( model )

        req.body.answer = {}
        // console.log(`[usage.controller] usageReport() model`, model)

        // C H E C K
        // L A S T
        // S E R V E R
        // M E S S A G E
        const msg = await setting.getUnreadSettingByServerId( model.server._id )

        // S E R V E R
        // M E S S A G E
        if (
            msg
        ) {
            req.body.answer.srv_msg = msg.body
        }

        // R E S P O N S E
        // W I T H
        // H I T C O U N T
        if (
            //
            // D E P R E C A T E D
            //
            // req.body.server.tolerance_visits
            
            //
            // D E P R E C A T E D
            //
            // req.body.hits &&
            // req.body.hits >= -1

            //
            // new version of conrtol flow
            //
            Number.isInteger( +req.body.hits )
            ) {

            // console.log(`[usage.controller] HITS req.body`, req.body)

            // U P D A T E
            // S E R V E R
            // const detla = ( +model.server.visit_remained - +model.tolerance_visits )
            const detla = ( +model.server.visit_remained - +req.body.hits )
            model.server = await server.updateServer( model.server._id, { visit_remained: detla })
            // console.log(`[usage.controller] usageReport() update server`, model.server)


            // S A V E
            // U S A G E
            // R E P O R T
            const usageObject: IUsage = {
                hitCount: req.body.hits,
                server: model.server._id,
                date: req.body.date,
            }
            // console.log(`[usage.controller] usageReport() usageObject`, usageObject)
            const temp: any = await usage.saveNewUsage( usageObject )
            // console.log(`[usage.controller] usageReport() after save usage`, temp)

            // console.log(`[usage.controller] model.server`, model.server)


            if (
                
                // C H E C K
                // H I T C O U N T

                // model.server.visit_remained < model.tolerance_visits ||

                // (
                //     model.server.visit_remained < 0 &&
                //     model.server.tolerance_visits < Math.abs( model.server.visit_remained )
                // ) ||
                
                model.server.visit_remained <= 0 ||

                // 
                // C H E C K
                // D U R A T I O N
                // 
                req.body.server.expireAt < now().toString()
                // model.server.status === danalica.process.bundles_expire.caption
            ) {
                req.body.answer.status = danalica.process.bundles_expire.caption
                model.server = await server.updateServer( model.server._id, {
                    status: danalica.process.bundles_expire.caption
                })
                console.log(`[usage.controller] usageReport() server bundle has been expired`)
                // console.log(`[usage.controller] usageReport() CHECK req.body.answer`, req.body.answer)
                return next()
            }
            
            req.body.answer.status = danalica.process.active.caption
            console.log(`[usage.controller] usageReport() `, req.body.answer)
            
        // }  else if (
        //     model.server.status === danalica.process.blocked_by_admin.caption
        //     ) {
        //         req.body.answer.status = danalica.process.blocked_by_admin.caption
        //         console.log(`[usage.controller] usageReport() THIS ACCOUNT BLOCKED BY ADMIN`)

        }  else {

            // C H E C K
            // L A S T
            // S T A T U S
            // const e = await server.getSingleServer( model.server._id )
            // req.body.answer.status = e.status

            req.body.answer.status = model.server.status

        }

        next()
    }

export var showMyBundleDetails = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
        if (
            !req.param('server_id') &&
            BaseRepository.checkMongoDBId( req.param('server_id') )
        ) {
            return res.status(400).json({
                error: true,
                title: 'need valid server_id'
            })
        }

        try {
            //
            // Regular Expression Denial of Service (ReDoS)
            //
            let value = req.param('server_id').replace(/\/|script|match|test|find|replace|<|>/gi, '')
            let serverQuery = await server.getSingleServer( value )
            console.log('[USAGE] serverQuery ', serverQuery)
            
            let now = new Date()
            let start = new Date(serverQuery.bundle.start)
            let timeDiff = Math.abs(now.getTime() - start.getTime())
            let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) 
            let data = {
                // 'bundleTitle' => 'Pakage 111',
                'bT': serverQuery.bundle.title,
                // 'bundleDuration' => '3',
                'bD': serverQuery.bundle.duration,
                // 'bundleVisits' => '5000',
                'bV': serverQuery.bundle.hit,
                // 'bundleStart' => '2019-01-01',
                'bS': start,
                // 'usedDuration' => '1',
                'uD': diffDays,
                // 'usedVisits' => '950',
                'uV': serverQuery.visit_remained
            }
            console.log('[USAGE] data ', data)
            return res.status(200).json(data)
        } catch (error) {
            return res.status(400).json({
                error: true,
                desciption: error
            })
        }
    }
            
/*************************************
 * 
 *         U T I L S
 * 
 *************************************/
export var idExtraction = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {

        // 
        // G E N E R A T E
        // _ I D
        // F R O M
        // R E S P O N S E
        // 
        let key = ''
        let start_index = 32
        let end_index = 32 + 24
        let id = ''
        console.log(`\n[usage.controller] END idExtraction() req.body`, req.body)
        for ( let i = start_index ; i < end_index ; i++ ) {
            id += req.body.body[i]
        }
        for ( let i = 0 ; i < start_index ; i++ ) {
            key += req.body.body[i]
        }
        for ( let i = end_index ; i < req.body.body.length ; i++ ) {
            key += req.body.body[i]
        }
        req.body.body = key
        req.body.server = id
        console.log(`\n[usage.controller] END idExtraction() req.body`, req.body)
        // return res.json(req.body)
        next()
    }

export var decryptPayload = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
        const DTO = await server.getSingleServer( req.body.server )
        
        // 
        // D E B U G
        // 
        // console.log(`\n[usage.controller] decryptPayload() :: server `, DTO)
        // return res.json( DTO )

        req.body = JSON.parse(await decryptRSA( req.body.body, DTO.private_key ))
        // // console.log(`[usage.controller] decryptPayload() :: req.body `, req.body)

        req.body.server = DTO
        // return res.json(req.body)
        next()
    }

export var statusEncryption = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {

        // 
        // D E B U G
        // 
        // console.log(`\n[usage.controller] decryptPayload() :: server `, DTO)
        // return res.json( req.body )

        // C Y P H E R
        // S T A T U S
        if (
            req.body.answer &&
            req.body.answer.status
        ) {
            // 825 => active
            // 150 => blocked_by_admin
            // 203 => bundles_expire
            // 122 => need_recharge
            switch ( req.body.answer.status ) {
                case danalica.process.active.caption:
                    req.body.answer.status = danalica.process.active.code
                    break
                case danalica.process.blocked_by_admin.caption:
                    req.body.answer.status = danalica.process.blocked_by_admin.code
                    break
                case danalica.process.bundles_expire.caption:
                    req.body.answer.status = danalica.process.bundles_expire.code
                    break
                case danalica.process.need_recharge.caption:
                    req.body.answer.status = danalica.process.need_recharge.code
                    break
            }
            let newStatus = ''
            let baseSatue = req.body.uid ? (req.body.uid).toString() : null
            baseSatue = baseSatue.split('').reverse().join('')
            // console.log('\n[usage.controller] statusEncryption() baseSatue',  baseSatue)

            for ( let i = 0 ; i < 2 ; i++ ) {
                newStatus += baseSatue[i]
            }
            newStatus += req.body.answer.status[1]
            for ( let i = 2 ; i < 6 ; i++ ) {
                newStatus += baseSatue[i]
            }
            newStatus += req.body.answer.status[0]
            for ( let i = 6 ; i < baseSatue.length - 5 ; i++ ) {
                newStatus += baseSatue[i]
            }
            newStatus += req.body.answer.status[2]
            req.body.answer.status = newStatus
            console.log('\n[usage.controller] statusEncryption() final payload',  req.body.answer)
            return next()
        }
        next()
    }


export var encryptPayload = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {

        // 
        // V A L I D A T I O N
        // 
        if (
            !req.body.server.client_public_key ||
            req.body.server.client_public_key === ""
        ) {
            return res.status(400).json({
                message: 'کلید عمومی کاربر مورد نظر در سامانه ثبت نشده است!',
                success: false
            })
        }
        
        // 
        // E N C R Y P T
        // P A Y L O A D
        // 
        console.log(`[usage.contoller] encryptPayload() : req.body.answer`, req.body.answer)
        const e = await encryptRSA( 
            JSON.stringify(req.body.answer),
            req.body.server.client_public_key )
        const model = {
            body: Buffer.from(e).toString('base64')
        }

        /**
         * 
         * T E S T
         * &
         * D E B U G
         * 
         */
        // const pr_k = `-----BEGIN RSA PRIVATE KEY-----\r\nMIICXAIBAAKBgQC5YwfzGiyMqpeSqRdj2JVz5PDG5X8osQamGwKL2z4uI/s+O7OO\r\nRndBWOPa1K7Nwhjlyc2Vmk43lT+aEiaQC2O5SbAYmbYqIeA5Nd5EJQFNxBJYq26W\r\njsuUyX/4WfB/+h+oZQ1n5XmdjaP+kecQkIYW8gQWFjLM7lAwwxS7TqZ13QIDAQAB\r\nAoGAaV+LzjdraQ0yGG+6Vsttr7FK1pLt4zA0Kkgh+2LEBi/3h9khZ1ZQRLmE0gaf\r\n0V5pDnvVOhq6KMfRnf6BItEGffvCWnZfIGMh7ffvSZT+53cLl6SIi6Q6CD6+47F8\r\nnVuIJPTLJgU+Mg2uOGZFrF4eFYIYCrdFr1dpItH7lZIEI1UCQQDqKjRVqvXrSdxi\r\nmbojStJqpK7eEyilKXQfz/RhuoJ0sQd/n94Dsl/RdRsL7quTaVd+NmF6uUeNenKk\r\nkXpgT1i3AkEAyqxv1lLO315r4GReNuaska9C81NHEKnQf764Hg+4NMoFFLxvEgb3\r\nR/iANxiu2occ7Zq4oeB9xt8daOAE3O2KCwJBAOnHaupgPRZDbkAOQ9Q6Pep0MZTK\r\nwdhqk2GzRsNO5jFEED1tSMSeD6VY6cC27hrEn7IE7rsMQRBRQCVmjCuc6+8CQFWD\r\nlFyV6/uLV3ECaE453i5KCLGqPZ3mSLbdvcnRUCPV6XbqWuL8VXHkhBS7MWu6/pWy\r\nZpzGn8s9cKdDfknJYCkCQHz8F0DfKjKqiNr0PSNpy+za3pJKxv3ij24XbSTnUlYe\r\nxjhrUbiGGOKOr78nNyN/mmPUB7VT/TY6IOvyylP2z2Q=\r\n-----END RSA PRIVATE KEY-----`
        // console.log(`[usage.contoller] ======================================`)
        // console.log(`[usage.contoller] `, pr_k)
        // console.log(`[usage.contoller] encryptPayload() : TEST ENCRYPTE VALUE`, model.body)
        // const test = await decryptRSA(model.body, pr_k)
        // console.log(`[usage.contoller] encryptPayload() : TEST ENCRYPTE VALUE`, test)
        // console.log(`[usage.contoller] ======================================`)
        res.status(200).json( model )

    }