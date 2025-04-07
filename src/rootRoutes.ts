import {Router} from "express";
import userRoutes from './services/users/routes/index.routes'
import adminRoutes from "./services/users/routes/admin_routes";

const router = Router();
router.use("/users", userRoutes);
// Admin routes
router.use('/admin', adminRoutes);

export default router;