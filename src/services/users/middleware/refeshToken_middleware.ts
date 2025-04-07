import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import * as process from "node:process";

// ACCESS_TOKEN EXPIRED AFTER LOGGING IN
export const refreshTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("refreshToken");
    if (!token)
      return res.status(403).json({ message: "Refresh token required." });

    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: VerifyErrors | null, user: string | JwtPayload | undefined) => {
        if (err)
          return res.status(403).json({ message: "Invalid or token expired." });

        req.user = user as JwtPayload;
        next();
        // const accessToken = jwt.sign({
        //     id: (user as any).id,
        //     email: (user as any).email
        // }, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: '5s'})
        // res.status(200).json({accessToken});
      },
    );
  } catch (e) {
    res
      .status(500)
      .json({
        message: "Failed to refresh token",
        error: (e as Error).message,
      });
  }
};
