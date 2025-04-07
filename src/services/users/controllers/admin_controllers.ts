import {Request, Response} from 'express';
import User from '../models/user.models';
import {CustomRequest} from '../middleware/accessToken_middleware';
import bcrypt from 'bcrypt';

const saltRounds = Number(10);

class AdminControllers {
    // Get all users (admin only)
    getAllUsers = async (req: Request, res: Response): Promise<any> => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'firstname', 'lastname', 'email', 'isVerified', 'role', 'createdAt', 'updatedAt']
            });

            return res.status(200).json({users});
        } catch (error) {
            return res.status(500).json({message: 'Failed to fetch users', error: (error as Error).message});
        }
    };

    // Get user by ID (admin only)
    getUserById = async (req: Request, res: Response): Promise<any> => {
        try {
            const {userId} = req.params;

            const user = await User.findByPk(userId, {
                attributes: ['id', 'firstname', 'lastname', 'email', 'isVerified', 'role', 'createdAt', 'updatedAt']
            });

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            return res.status(200).json({user});
        } catch (error) {
            return res.status(500).json({message: 'Failed to fetch user', error: (error as Error).message});
        }
    };

    // Update user role (admin only)
    updateUserRole = async (req: Request, res: Response): Promise<any> => {
        try {
            const {userId} = req.params;
            const {role} = req.body;

            // Validate role
            if (!['user', 'admin', 'moderator'].includes(role)) {
                return res.status(400).json({message: 'Invalid role. Role must be user, admin, or moderator'});
            }

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            // Prevent self-demotion for admin safety
            const requestingUser = (req as CustomRequest).user;
            if (user.id === requestingUser?.id && role !== 'admin') {
                return res.status(403).json({message: 'Admins cannot demote themselves'});
            }

            user.role = role;
            await user.save();

            return res.status(200).json({
                message: 'User role updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            return res.status(500).json({message: 'Failed to update user role', error: (error as Error).message});
        }
    };

    // Delete user (admin only)
    deleteUser = async (req: Request, res: Response): Promise<any> => {
        try {
            const {userId} = req.params;

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            // Prevent self-deletion for admin safety
            const requestingUser = (req as CustomRequest).user;
            if (user.id === requestingUser?.id) {
                return res.status(403).json({message: 'Admins cannot delete themselves'});
            }

            await user.destroy();

            return res.status(200).json({message: 'User deleted successfully'});
        } catch (error) {
            return res.status(500).json({message: 'Failed to delete user', error: (error as Error).message});
        }
    };

    // Create initial admin user (for system setup)
    createInitialAdmin = async (req: Request, res: Response): Promise<any> => {
        try {
            // Check if any admin already exists
            const adminExists = await User.findOne({where: {role: 'admin'}});

            if (adminExists) {
                return res.status(400).json({
                    message: 'Admin user already exists. Use the admin login to create additional admins.'
                });
            }

            const {firstname, lastname, email, password} = req.body;

            if (!firstname || !lastname || !email || !password) {
                return res.status(400).json({message: 'All fields are required'});
            }

            // Check if user exists
            const userExists = await User.findOne({where: {email}});
            if (userExists) {
                return res.status(400).json({message: 'User already exists'});
            }

            // Hash password
            const hashPassword = await bcrypt.hash(password, saltRounds);

            // Create admin user (skips verification for initial admin)
            const admin = await User.create({
                firstname,
                lastname,
                email,
                password: hashPassword,
                verificationToken: '',
                isVerified: true,
                role: 'admin'
            });

            return res.status(201).json({
                message: 'Initial admin user created successfully',
                admin: {
                    id: admin.id,
                    email: admin.email,
                    role: admin.role
                }
            });
        } catch (error) {
            return res.status(500).json({message: 'Failed to create admin user', error: (error as Error).message});
        }
    };
}

export default new AdminControllers();
