import  jwt  from 'jsonwebtoken';
import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import config from "../../config";

const loginUser = async(email: string, password: string)=>{
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if(result.rows.length === 0){
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password)

  if(!match){
    return false;
  }

  
  const token = jwt.sign({name: user.name, email: user.email, role: user.role}, config.jwtSecret as string, {
    expiresIn: "7d",
  });
  // console.log({token});
  delete user.password;
  delete user.created_at;
  delete user.updated_at;

  return {token, user};
};

export const authServices = {
  loginUser,
}