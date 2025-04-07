import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "./accessToken_middleware";

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as CustomRequest).token;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRole = (user as any).role;

      if (!roles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Authorization error",
          error: (error as Error).message,
        });
    }
  };
};
