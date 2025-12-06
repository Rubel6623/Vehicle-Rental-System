import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/users/user.route";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to vehicle rental management system !!");
});

app.use("/api/v1/users", userRoutes);

app.put("/users/:id", async(req:Request, res:Response)=>{
  const { name, email ,phone, role} = req.body;

  try {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2, phone=$3, role=$4, WHERE id=$5 RETURNING *`, [name,email,phone, role, req.params.id]);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      })
    }

  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err
    })
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
