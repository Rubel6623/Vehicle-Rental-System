import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized !! You are not allowed !!." });
      }

      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token!, config.jwtSecret as string) as JwtPayload;
      
      // console.log(decoded);
      req.user = decoded;

      if(roles.length && !roles.includes(decoded.role as string)){
        return res.status(401).json({
          error: "unauthorized...!!"
        })
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default auth;
