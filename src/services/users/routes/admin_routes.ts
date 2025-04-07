import {Router} from 'express';
import AdminControllers from '../controllers/admin_controllers';
import {accessTokenValidator} from '../middleware/accessToken_middleware';
import {requireRole} from '../middleware/authorization';

const adminRoutes = Router();

// Admin user management routes (protected)
// @ts-ignore
adminRoutes.get('/users', accessTokenValidator, requireRole(['admin']), AdminControllers.getAllUsers);
// @ts-ignore
adminRoutes.get('/users/:userId', accessTokenValidator, requireRole(['admin']), AdminControllers.getUserById);
// @ts-ignore
adminRoutes.put('/users/:userId/role', accessTokenValidator, requireRole(['admin']), AdminControllers.updateUserRole);
// @ts-ignore
adminRoutes.delete('/users/:userId', accessTokenValidator, requireRole(['admin']), AdminControllers.deleteUser);

// Special route for creating initial admin (only available if no admin exists)
adminRoutes.post('/setup', AdminControllers.createInitialAdmin);

export default adminRoutes;