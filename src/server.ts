import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { vehicleRouter } from "./modules/vehicles/vehicle.route";
import { bookingRouter } from "./modules/booking/booking.route";

const app = express();
const port = config.port;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to vehicle rental management system !!");
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehicleRouter);

app.use("/api/v1/bookings", bookingRouter);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
