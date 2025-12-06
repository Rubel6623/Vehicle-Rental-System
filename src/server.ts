import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to vehicle rental management system !!");
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
