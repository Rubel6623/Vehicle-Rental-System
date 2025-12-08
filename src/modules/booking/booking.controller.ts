import { pool } from "../../config/db";
import { vehicleController } from "../vehicles/vehicle.controller";
import { vehicleService } from "../vehicles/vehicle.service";
import { bookingService } from "./booking.service";
import { Request, Response } from 'express';


const createBooking = async(req: Request, res: Response)=>{

  try {   
    const { customer_id, vehicle_id, rent_start_date, rent_end_date} = req.body;

    const vehicleData = await vehicleService.getSingleVehicle(vehicle_id);

  if (!vehicleData) {
      return res.status(404).json({ success: false, message: "Vehicle not found" });
    }

    const start = new Date(rent_start_date).getTime();
    const end = new Date(rent_end_date).getTime();
    const number_of_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));    

    if (number_of_days <= 0) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const vehicle = vehicleData.rows[0];
    
    const total_price = number_of_days * Number(vehicle.daily_rent_price);

    const result = await bookingService.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price);

    res.status(200).json({
      success: true,
      message: "Booking created successfully",
      data: result
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message      
    })
  }
};

const getBookings = async(req: Request, res: Response)=>{
  try {
    const result = await bookingService.getBookings();

    result.rows = result.rows.map((booking) => ({
      ...booking,
      total_price: Number(booking.total_price),
    }));

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
}

export const bookingController = {
  createBooking,
  getBookings,
}