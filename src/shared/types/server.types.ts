import {JwtPayload} from "jsonwebtoken";

interface App {
    name: string;
    host: string;
    port: number;
}

interface Database {
    name: string;
    port: number;
    username: string;
    password: string;
}

export interface ServerConfig {
    app: App;
    database: Database;
}


declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload; // Attach user property to Request
    }
}
