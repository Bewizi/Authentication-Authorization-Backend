import User from '../models/user.models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from "express";
import * as process from "node:process";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {CustomRequest} from "../middleware/accessToken_middleware";

dotenv.config();

const saltRounds = Number(10)

class AuthenticationControllers {
    refreshToken = async (req: Request, res: Response): Promise<any> => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(403).json({message: "Unauthorized access."});
            }

            // Generate new access token
            const accessToken = jwt.sign(
                {id: (user as any).id, email: (user as any).email},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: "5s"}
            );

            res.status(200).json({accessToken});
        } catch (error) {
            res.status(500).json({message: "Failed to refresh token", error: (error as Error).message});
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {firstname, lastname, email, password, role = 'user'} = req.body;

            const requestingUser = (req as CustomRequest).user
            if (role === 'admin' && (!requestingUser || requestingUser.role === 'admin')) {
                return res.status(403).json({message: "Only admins can create admin accounts"})
            }

            let user = await User.findOne({where: {email}})

            // to hash password
            const hashPassword = await bcrypt.hash(password, saltRounds)
            if (user !== null) {
                throw new Error('User already exists');
            }

            // Generate email verification token
            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            // console.log(firstname, email, email, password);
            // Create User with verification
            user = await User.create({
                firstname,
                lastname,
                email,
                password: hashPassword,
                verificationToken,
                isVerified: false,
                role
            });

            //Send email with verification token
            await this.sendVerificationEmail(email, verificationToken);

            res.status(200).json({message: "Registration Successful, check your email for verification code", user});
            next()
        } catch (e) {
            res.status(500).json({message: "Something went wrong", error: (e as Error).message});
        }
    }

    verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, token} = req.body;
            const user = await User.findOne({where: {email}})

            if (!user) {
                return res.status(404).json({message: "User not found"})
            }

            if (user.verificationToken !== token) {
                return res.status(400).json({message: "Invalid verification token"})
            }

            //     Mark User as verified
            user.isVerified = true;
            user.verificationToken = "";
            await user.save();

            res.status(200).json({message: "Email verified successfully. You can now log in.", user});
            next();
        } catch (e) {
            res.status(500).json({message: "Email verification failed", e: (e as Error).message});
        }
    }

    // login with email and password
    login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const {email, password} = req.body;
            const user = await User.findOne({where: {email}})
            if (!user) throw new Error('User already exists');

            if (!user.isVerified) return res.status(401).json({message: "Email not verified. please check your email"})


            if (!(await bcrypt.compare(password, user.password))) throw new Error('Passwords do not match');

            // Generate access token
            const accessToken = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            }, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '1h'})


            // Generate refresh token
            const refreshToken = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            }, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: '5d'})


            res.status(200).json({message: "Login Successful", accessToken, refreshToken});
            next()

        } catch (e) {
            console.log(e)
            res.status(500).json({message: "Login Failed", error: (e as Error).message});
        }
    }

    sendVerificationEmail = async (email: string, token: string): Promise<void> => {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.mail.yahoo.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.YAHOO_USER,
                    pass: process.env.YAHOO_PASS
                },
                debug: true,
                logger: true
            });

            const mailOptions = {
                from: process.env.YAHOO_USER,
                to: email,
                subject: "Email verification",
                html: `<p>Hello,</p>
                   <p>Your verification code is: <strong>${token}</strong></p>
                   <p>Please enter this code in the app to verify your email.</p>`,
            };
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully: ", info.response)
        } catch (e) {
            console.error("❌ Error sending email:", e);
        }
    }
}

export default new AuthenticationControllers()