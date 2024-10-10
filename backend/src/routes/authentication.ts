import { NextFunction, Request, Response } from "express";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../services/JWTService";

declare global {
    namespace Express {
        export interface Request {
            /**
             * Mongo-ID of currently logged in pfleger; or undefined, if pfleger is a guest.
             */
            pflegerId?: string;
            /**
             * Role of currently logged in pfleger; or undefined, if pfleger is a guest.
             */
            role?: "u" | "a";
        }
    }
}

export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    req.pflegerId = undefined
    try {
        let jwtString = req.cookies.access_token
        if (!jwtString) {
            res.sendStatus(401)
        }
        let pfleger = verifyJWT(jwtString)
        req.pflegerId = pfleger.id
        req.role = pfleger.role
        next();
    }
    catch (err) {
        res.sendStatus(401)
        next(err)

    }
}

export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    req.pflegerId = undefined
    let jwtString=req.cookies["access_token"]
    if (jwtString) {
        try {
            let pfleger = verifyJWT(jwtString)

            if (pfleger.exp === 0) {
                res.sendStatus(401)
            }
            req.pflegerId = pfleger.id
            req.role = pfleger.role
            
            return next();
        }
        catch (err) {
            res.sendStatus(401)
            return next(err)

        }
    }
    next()
}