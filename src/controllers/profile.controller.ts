
import * as express from 'express';
import {
    profile,
    IProfile,
    responseStandard
} from '../models';

export var findAllProfileData = async (
    req: express.Request,
    res: express.Response
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    var result = new responseStandard()

    // D A T A B A S E
    // Q U E R Y 
    const temp: any = await profile.getAllProfile()

    // E R R O R
    // H A N D E L I N G
    if ( temp && !temp.error ) {
        result.setData( temp )
        res.status(200).json( result.fetch() )
    } else {
        result.setError(1, 'تست نا موفق انجام شد')
        res.status(404).json( result.fetch() )
    }
}

// 
// export var findSingleProfile = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//     // S E T
//     // S T A N D A R D
//     // R E S P O N S E
//     var result = new responseStandard()

//     // V A L I D A T E
//     // R E Q U E S T
//     if (
//         !req.param('id')
//     ) {
//         result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
//         return res.status(422).json( result.fetch() )
//     }

//     // D A T A B A S E
//     // Q U E R Y 
//     const temp = await profile.getSingleProfile( req.param('id') )

//     // E R R O R
//     // H A N D E L I N G
//     if ( temp && !temp.errors ) {
//         result.setData( temp )
//         res.status(200).json( result.fetch() )
//     } else {
//         result.setError(1, 'هیچ بستهی با مشخصات درخواست شما تطابق ندارد')
//         res.status(404).json( result.fetch() )
//     }
 
// }

// export var createNewProfile = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//     // S E T
//     // S T A N D A R D
//     // R E S P O N S E
//     var result = new responseStandard()


//     // M O C K
//     // D A T A
//     // {
//     //     "url": "http://aseman.areo",
//     //     "crm_ref": "http://12.352.12.10:1520/crm/user/4321",
//     //     "profile": null,
//     //     "expireAt": "2018-10-23T12:32:10.000z",
//     //     "resHits": "5000",
//     //     "extraTime": "100",
//     //     "extraHits": "1000",
//     //     "license": ObjectId("5bc73a1e49059c9f35615f79"),
//     //     "private_key": null,
//     //     "public_key": null,
//     //     "client_public_key": null,
//     //     "status": "active"
//     // }

//     //
//     // D E B U G
//     // M O D E
//     // 
//     //  curl -X POST -d '{"category": "company","description": "sample note goes here","duration": "30", "hit": "10000", "hitPeroid": "30", "start": null, "status": "active","title": "christmas profile"}' -H "Content-Type:application/json"  http://localhost/profile | python -m json.tool
//     // 


//     // V A L I D A T E
//     // R E Q U E S T
//     // if (
//     //     !req.body.url
//     // ) {
//     //     result.setError(1, 'اطلاعات شما برای ثبت بسته جدید ناقص است')
//     //     console.log('[profile.controller] ERROR');
//     //     return res.status(422).json( result.fetch() )
//     // }

//     // D A T A B A S E
//     // Q U E R Y 
//     const valueToSave: IProfile = req.body
//     console.log('[profile.controller][DEBUG] new profile data', valueToSave);
//     const temp: any = await profile.saveNewProfile( valueToSave )

//     // C H E C K
//     // C U R L
//     // curl -X POST -H "Content-Type: application/json" -d '{"ip":"1398.25.10.10","company":"ircu-ul"}' http://localhost:3001/profile

//     // E R R O R
//     // H A N D E L I N G
//     if ( temp && !temp.errors ) {
//         result.setData( temp )
//         res.status(201).json( result.fetch() )
//     } else {
//         result.setError(1, 'بسته مورد نظر ساخته نشد')
//         res.status(422).json( result.fetch() )
//     }

// }

// export var updateProfileDetails = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//     // S E T
//     // S T A N D A R D
//     // R E S P O N S E
//     var result = new responseStandard()


//     // V A L I D A T E
//     // R E Q U E S T
//     if (
//         !req.body.title &&
//         !req.body.url &&
//         !req.body.ip &&
//         !req.body.status 
//     ) {
//         result.setError(1, 'اطلاعات شما برای بروز رسانی بسته ناقص است')
//         return res.status(422).json( result.fetch() )
//     }

//     // D A T A B A S E
//     // Q U E R Y
//     const temp = await profile.updateProfile( req.param('id'), req.body )

//     // E R R O R
//     // H A N D E L I N G
//     if ( temp && !temp.error ) {
//         result.setData( temp )
//         res.status(200).json( result.fetch() )
//     } else {
//         result.setError(1, 'بسته مورد نظر بروزرسانی نشد')
//         res.status(404).json( result.fetch() )
//     }

// }

// export var archiveProfileById = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//     // S E T
//     // S T A N D A R D
//     // R E S P O N S E
//     var result = new responseStandard()

//     // V A L I D A T E
//     // R E Q U E S T
//     if (
//         !req.param('id')
//     ) {
//         result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
//         return res.status(422).json( result.fetch() )
//     }

//     // D A T A B A S E
//     // Q U E R Y
//     const temp = await profile.archiveProfile( req.param('id') )
    
//     // E R R O R
//     // H A N D E L I N G
//     if ( temp && !temp.error ) {
//         result.setData( temp )
//         res.status(200).json( result.fetch() )
//     } else {
//         result.setError(1, 'بسته مورد نظر یافت نشد')
//         res.status(404).json( result.fetch() )
//     }
// }

// export var deleteProfileById = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//     // S E T
//     // S T A N D A R D
//     // R E S P O N S E
//     var result = new responseStandard()

//     // V A L I D A T E
//     // R E Q U E S T
//     if (
//         !req.param('id')
//     ) {
//         result.setError(1, 'ای دی بسته مورد نظر توسط شما ارسال نشد')
//         return res.status(422).json( result.fetch() )
//     }

//     // D A T A B A S E
//     // Q U E R Y
//     const temp = await profile.deleteProfile( req.param('id') )
    
//     // E R R O R
//     // H A N D E L I N G
//     if ( temp && !temp.error ) {
//         result.setData( temp )
//         res.status(200).json( result.fetch() )
//     } else {
//         result.setError(1, 'بسته مورد نظر یافت نشد')
//         res.status(404).json( result.fetch() )
//     }
// }

// export var chargeProfile = async (
//     req: express.Request,
//     res: express.Response
//     ) => {
//         // S E T
//         // S T A N D A R D
//         // R E S P O N S E
//         var result = new responseStandard()

//         // 
//         // V A L I D A T E
//         // B U N D L E
//         // 
//         if (
//             !req.param('profile_id') || 
//             !BaseRepository.checkMongoDBId( req.param('profile_id') )
//         ) {
//             result.setError(1, 'بسته مورد نظر درست انتخاب نشده است')
//             return res.status(400).json( result.fetch() )
//         }

//         // 
//         // V A L I D A T E
//         // S E R V E R
//         // 
//         if (
//             !req.param('server_id') || 
//             !BaseRepository.checkMongoDBId( req.param('server_id') )
//         ) {
//             result.setError(1, 'سرور مورد نظر انتخاب نشده است')
//             return res.status(400).json( result.fetch() )
//         }

//         // D A T A B A S E
//         // Q U E R Y
//         const profileDto: IProfile = await profile.getSingleProfile( req.param('profile_id') )
//         let temp: any
//         if ( profileDto && profileDto._id ) {
//             temp = await server.chargeServer( req.param('server_id'), profileDto )
//         }
        
//         // E R R O R
//         // H A N D E L I N G
//         if ( temp && !temp.error ) {
//             result.setData( temp )
//             res.status(200).json( result.fetch() )
//         } else {
//             result.setError(1, 'عملیات شارژ اتفاق نیفتاد')
//             res.status(404).json( result.fetch() )
//         }
//     }

const database = [
    {
        id: 1,
        username: 'mimani',
        password: '123',
        email: 'imani.mahdi@gmail.com'
    },
    {
        id: 2,
        username: 'alitaheri',
        password: '123',
        email: 'ataheri@gmail.com'
    },
]

export var isUserExists = function(user: any) {
    let result = database.filter( x => x.username === user.username )
    if ( result.length >= 1 ) {
        return { isValidUser: true }
    }
    return { isValidUser: false }
}
