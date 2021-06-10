import * as admin from 'firebase-admin';
import * as serviceAccount from './../firebase.json';
import {Request, Response, NextFunction} from 'express';

const databaseURL = process.env.FIREBASE_URL;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL
});

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authtoken) {
        const authToken : string = req.headers.authtoken as string;
        admin.auth().verifyIdToken(authToken)
            .then(value => {
                res.locals.user = value;
                next();
            }).catch(() => {
                res.status(401).send('Unauthorized')
            });
    } else {
        res.status(401).send('Unauthorized')
    }
}

export {checkAuth}