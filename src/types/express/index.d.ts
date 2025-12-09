import { Roles } from './../../modules/auth/auth.constant';
import { JwtPayload } from "jsonwebtoken";

declare global{
  namespace Express{
    interface Request{
      user?: JwtPayload;      
    }
  }
}