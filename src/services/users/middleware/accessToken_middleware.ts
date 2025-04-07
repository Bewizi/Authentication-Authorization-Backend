import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import * as process from "node:process";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user?: {
        id: string,
        email: string,
        role: string
    }
}

// ACCESS_TOKEN EXPIRED AFTER LOGGING IN
export const accessTokenValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const token =

            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({message: "No token provided."});

        // (req as CustomRequest).token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
        (req as CustomRequest).token = decoded;
        (req as CustomRequest).user = {id: decoded.id, email: decoded.email, role: decoded.role};
        next();
    } catch (e) {
        res.status(401).send("Please authenticate");
    }
};