import {ServerConfig} from "../types/server.types";
import dotenv from "dotenv";

dotenv.config();

const getEnv = (name: string) => {
    return process.env[name] ?? "";
}

const config: ServerConfig = {
    app: {
        name: getEnv("APP_NAME"),
        host: getEnv("APP_HOST"),
        port: Number(getEnv("APP_HOST_PORT")),
    },
    database: {
        name: getEnv("DATABASE_NAME"),
        port: Number(getEnv("DATABASE_PORT")),
        username: getEnv("DATABASE_USERNAME"),
        password: getEnv("DATABASE_PASSWORD"),
    },
}

export default config;