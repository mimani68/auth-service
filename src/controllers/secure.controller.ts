import * as express from 'express';
import * as forge from 'node-forge';
import {
    responseStandard,
    server
} from '../models';

export let getPublicKey = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    let result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if (
        !req.param('server_unique_id')
    ) {
        result.setError(1, 'هیچ سروری انتخاب نشده است');
        return res.status(422).json( result.fetch() );
    }

    const server_details = await server.getSingleServer(req.param('server_unique_id'));
    const payload = {
        public: server_details.public_key
    }
    console.log(`[secure] server-details`, server_details);

    if ( server_details && server_details._id ) {
        result.setData( payload );
        res.status(200).json( result.fetch() );
    } else {
        result.setError(1, 'سرور مورد نظر یافت نشد');
        res.status(404).json( result.fetch() );
    }

}


export let renewRSAKeys = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
        let e = await createServerKeys( req.param('server_unique_id') );
        res.status(200).json(e);
}

export let validateEncryption = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
        let privateKey = `-----BEGIN RSA PRIVATE KEY-----\r\nMIICWwIBAAKBgQCPMYNrmAVtuQHyQjbvB50NvZhaxYx8CQhWh3Ws8xxHyC/ir3iY\r\nq1XbNiuA+H0Ih/tfm1U9HHFtVZkVkFIxedLSF+AJt1TwYNULHsnpJV0uUVOt1ofZ\r\nvYHWcPsyAR09QLblVxKtyGDzQfeKIBhW6dcyxx2FGfwfRbyahadruoXSkQIDAQAB\r\nAoGAHLZL6MYZyI+BQWdfhnxbVIcAxqq36aMSBe+xe9VfhVExsN2Ia+xnEcaB4KFy\r\nyMQjdl86Lz/FyquQP4+pu3v29pbDWaSBm4DETxJ5IoNUWGt95wbMwCfAjiyF+/Pl\r\nA/6OOEmUfZm4B+uQ9mfmHlWFQy+lDpKVl263i4LFDaaPWTECQQDBw1wVXnskD74x\r\n8aYlaJMBy1DFt9+ExYUttTUn/eKX1ZtIOxMNz35RRGtmrSj9H5le3WWIOSgrLXhJ\r\nd/Q/iiaFAkEAvS/v4/CnBghgcwuiJ9EAEdR8OLu8zsO4vpDOE5rnpvJ+fDt/4T7E\r\nVU1LFdON2zEvm48JYzLiItvEgXzlQ3FXnQJAGAon65LMTl4Rp9qmVW/TBV73R4CX\r\nn75t1ozr6mlKarIa0OxbYdRDhMurU5LaSgVYnvdy+GK3BBxhFyRlzlhSjQJANHac\r\nsbtEthmQlZa+SwhcWpVwNVNqknQYQVBqtWkZoGRSyyS827vKOlWK4uydxBEpwJuz\r\n4Lx1lXEYV0hJU6CUyQJAWZZJ+OWSoJq8eTyvUOoypD4XTYlMgnTXoPMc8ROsMcty\r\n+PKqtUfC5MCMgUjcTtYp/6F530gJQ+axn4tNRrdIEw==\r\n-----END RSA PRIVATE KEY-----\r\n`
        res.status(200).json({
            request: req.body.body,
            decoded: await decryptRSA(req.body.body, privateKey)
        })
    }


export let sampleNodeForge = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
    ) => {
        // let privateKey = `-----BEGIN RSA PRIVATE KEY-----\r\nMIICWwIBAAKBgQCPMYNrmAVtuQHyQjbvB50NvZhaxYx8CQhWh3Ws8xxHyC/ir3iY\r\nq1XbNiuA+H0Ih/tfm1U9HHFtVZkVkFIxedLSF+AJt1TwYNULHsnpJV0uUVOt1ofZ\r\nvYHWcPsyAR09QLblVxKtyGDzQfeKIBhW6dcyxx2FGfwfRbyahadruoXSkQIDAQAB\r\nAoGAHLZL6MYZyI+BQWdfhnxbVIcAxqq36aMSBe+xe9VfhVExsN2Ia+xnEcaB4KFy\r\nyMQjdl86Lz/FyquQP4+pu3v29pbDWaSBm4DETxJ5IoNUWGt95wbMwCfAjiyF+/Pl\r\nA/6OOEmUfZm4B+uQ9mfmHlWFQy+lDpKVl263i4LFDaaPWTECQQDBw1wVXnskD74x\r\n8aYlaJMBy1DFt9+ExYUttTUn/eKX1ZtIOxMNz35RRGtmrSj9H5le3WWIOSgrLXhJ\r\nd/Q/iiaFAkEAvS/v4/CnBghgcwuiJ9EAEdR8OLu8zsO4vpDOE5rnpvJ+fDt/4T7E\r\nVU1LFdON2zEvm48JYzLiItvEgXzlQ3FXnQJAGAon65LMTl4Rp9qmVW/TBV73R4CX\r\nn75t1ozr6mlKarIa0OxbYdRDhMurU5LaSgVYnvdy+GK3BBxhFyRlzlhSjQJANHac\r\nsbtEthmQlZa+SwhcWpVwNVNqknQYQVBqtWkZoGRSyyS827vKOlWK4uydxBEpwJuz\r\n4Lx1lXEYV0hJU6CUyQJAWZZJ+OWSoJq8eTyvUOoypD4XTYlMgnTXoPMc8ROsMcty\r\n+PKqtUfC5MCMgUjcTtYp/6F530gJQ+axn4tNRrdIEw==\r\n-----END RSA PRIVATE KEY-----\r\n`
        res.status(200).json(await nodeForgeRSA())
    }


/*************************************
 * 
 *         P R I V A T E
 *         M E T H O D S
 * 
 *************************************/
export let generateKeyPEMBufferPair = async (
    modulus: any,
    exponent: any
    ) => {
    let keypair = forge.pki.rsa.generateKeyPair(modulus, exponent);
    // let keypair = forge.pki.rsa.generateKeyPair(2048, 0x10001);
    // let publicPEMBuffer = new Buffer(forge.pki.publicKeyToPem(keypair.publicKey), 'utf8');
    // let privatePEMBuffer = new Buffer(forge.pki.privateKeyToPem(keypair.privateKey), 'utf8');
    // console.log(forge.pki.publicKeyToPem(keypair.publicKey));
    // console.log(forge.pki.privateKeyToPem(keypair.privateKey));
    return {
        public: forge.pki.publicKeyToPem(keypair.publicKey),
        private: forge.pki.privateKeyToPem(keypair.privateKey)
    };
    // return {
    //     publicPEM: publicPEMBuffer,
    //     privatePEM: privatePEMBuffer
    // };
}

export let createServerKeys = async ( server_id: string | number ) => {
    // S E T
    // S T A N D A R D
    // R E S P O N S E
    let result = new responseStandard()

    // V A L I D A T E
    // R E Q U E S T
    if ( !server_id ) {
        result.setError(1, 'هیچ سروری انتخاب نشده است');
        return result.fetch();
    }

    const keys = await generateKeyPEMBufferPair(1024, 0x10001);

    const payload = {
        public: keys.public,
        // private: keys.private
    }

    await server.update( server_id , {
        "private_key": keys.private,
        "public_key": keys.public
    });

    result.setData( payload );
    return result.fetch();

}


export let encryptRSA = async (
    secret: string,
    publicKeyInput: string
    ) => {
    // console.log('\n********| encryptRSA |**********');
    console.log('\n[encryptRSA] input\n', secret);
    let publicKeyBuffer = new Buffer( publicKeyInput );
    let publicKey: any = forge.pki.publicKeyFromPem(publicKeyBuffer.toString('utf8'));
    let secretBuffer: any = Buffer.from(secret,'utf8').toString('hex');
    let secretBytes = forge.util.hexToBytes(secretBuffer.toString('hex'));
    let encodedKeyBytes = publicKey.encrypt(secretBytes);
    let encodedKeyBuffer =  new Buffer(forge.util.bytesToHex(encodedKeyBytes), 'hex');
    // console.log('\n[*] encryptRSA\n', encodedKeyBuffer);
    // console.log('\n[*] encryptRSA\n', Buffer.from(encodedKeyBuffer).toString('utf8') );
    console.log('\n[encryptRSA] encryptRSA\n', Buffer.from(encodedKeyBuffer).toString('base64') );
    // console.log('\n[*] encryptRSA hex\n', forge.util.bytesToHex(encodedKeyBytes).toString('utf8'));
    return encodedKeyBuffer;
    
}

export let decryptRSA = async (
    encryptedBase64: string,
    privateKeyInput: string
    ) => {
    // console.log('\n********| decryptRSA |**********')
    console.log('\n[decryptRSA] decryptRSA input encryptedBase64 \n', encryptedBase64)
    let encryptedBytes = ''
    const encryptedHex = Buffer.from(encryptedBase64,'base64').toString('hex')
    // console.log('\n[*] decryptRSA input hex \n', encryptedHex)
    encryptedBytes = forge.util.hexToBytes(encryptedHex)
    // console.log('\n[*] decryptRSA input byte \n', encryptedBytes)
    // console.log('\n[*] decryptRSA privateKey \n', Buffer.from(privateKeyInput).toString('utf8'))
    let privateKey: any = forge.pki.privateKeyFromPem(Buffer.from(privateKeyInput).toString('utf8'))
    // console.log('\n[*] privateKey after use FORGE \n', privateKey)
    // let encryptedBytes = forge.util.hexToBytes(encryptedBuffer.toString('hex'))
    let decryptedBytes = privateKey.decrypt(encryptedBytes)
    // console.log('\n[*] decryptRSA decryptedBytes \n', decryptedBytes)
    let decryptedBuffer = new Buffer(forge.util.bytesToHex(decryptedBytes), 'hex')
    // console.log('\n[*] decryptRSA hex \n', decryptedBuffer.toString('hex'))
    // console.log('\n[*] decryptRSA result decryptedBuffer \n', decryptedBuffer)
    console.log('\n[decryptRSA] decryptRSA utf8 \n', decryptedBuffer.toString('utf8'))
    return decryptedBuffer.toString('utf8')
}


export let nodeForgeRSA = async () => {

    var TEXT: string = JSON.stringify({
        id: 123,
        title: 'sample title',
        server_id: '83gtdg39yhd02',
        status: new Date().getTime()
    });

    var KEY: any = forge.pki.rsa.generateKeyPair({
        bits: 2048,
        e: 0x10001
    });

    KEY.privateKey.pem = forge.pki.privateKeyToPem(KEY.privateKey);
    KEY.publicKey.pem = forge.pki.publicKeyToPem(KEY.publicKey);

    var encrypted = KEY.publicKey.encrypt(TEXT);
    console.log('[encrypted text]', encrypted);
    var decrypted = KEY.privateKey.decrypt(encrypted);
    console.log('[decrypted text]', decrypted);

    return {
        // value: TEXT,
        encrypted_value: encrypted,
        encrypted_base64_value: new Buffer(encrypted, 'utf8').toString('base64'),
        decrypted_value: decrypted,
        // public: KEY.publicKey.pem,
        // private: KEY.privateKey.pem,
    }
}