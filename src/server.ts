import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to vehicle rental management system !!");
});

app.listen(port, ()=>{
  console.log(`App listening on port ${port}`);
})