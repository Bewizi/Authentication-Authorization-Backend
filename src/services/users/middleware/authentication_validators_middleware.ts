import {NextFunction, Request, Response} from "express";


export const loginValidator = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {email, password} = req.body;
        if (!email || !password)
            return res.status(401).json({message: "Invalid email or password"});
        next();
    } catch (e) {
        console.log(e);
        res
            .status(422)
            .json({message: "validation failed", error: (e as Error).message});
    }
};

export const registerValidator = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {firstname, lastname, email, password} = req.body;
        if (!firstname || !lastname || !email || !password)
            return res.status(401).json({
                message:
                    "Invalid user details created, please enter the correct details",
            });
        next();
    } catch (e) {
        console.log(e);
        res
            .status(422)
            .json({message: "validation failed", error: (e as Error).message});
    }
};

export const verifyTokenValidator = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {email, token} = req.body;
        if (!email || !token)
            return res.status(401).json({message: "Invalid email and token"});
        next();
    } catch (e) {
        console.log(e);
        res
            .status(422)
            .json({message: "validation failed", error: (e as Error).message});
    }
};


