import {Router} from 'express'
import AuthenticationControllers from "../controllers/authentication_controllers";
import {
    loginValidator,
    registerValidator,
    verifyTokenValidator
} from "../middleware/authentication_validators_middleware";
import {refreshTokenValidator} from "../middleware/refeshToken_middleware";
import {requireRole} from "../middleware/authorization";
import {accessTokenValidator} from "../middleware/accessToken_middleware";
import adminRoutes from "./admin_routes";

const routes = Router();

// Authentication routes
// @ts-ignore
routes.post('/register', registerValidator, AuthenticationControllers.register)
// @ts-ignore
routes.post('/login', loginValidator, AuthenticationControllers.login)
// @ts-ignore
routes.post('/verifyEmail', verifyTokenValidator, AuthenticationControllers.verifyEmail)
// @ts-ignore
routes.post('/refreshToken', refreshTokenValidator, AuthenticationControllers.refreshToken)


// @ts-ignore
routes.post('/admin/register', refreshTokenValidator, accessTokenValidator, requireRole(['admin']), registerValidator, AuthenticationControllers.register);


export default routes