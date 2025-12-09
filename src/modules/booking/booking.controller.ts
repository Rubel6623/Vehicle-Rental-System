import { pool } from "../../config/db";
import { vehicleController } from "../vehicles/vehicle.controller";
import { vehicleService } from "../vehicles/vehicle.service";
import { bookingService } from "./booking.service";
import { Request, Response } from "express";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    const vehicleData = await vehicleService.getSingleVehicle(vehicle_id);

    if (!vehicleData.rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    const vehicle = vehicleData.rows[0];

    if (vehicle.availability_status !== "available") {
      return res.status(400).json({
        message: "Vehicle is not available for booking",
      });
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

    const total_price = number_of_days * Number(vehicle.daily_rent_price);

    const result = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price
    );

    await vehicleService.updateVehicleStatus(vehicle_id, "booked");

    result.total_price = Number(result.total_price);

    (result.rent_start_date = result.rent_start_date
      .toISOString()
      .split("T")[0]),
      (result.rent_end_date = result.rent_end_date.toISOString().split("T")[0]),
      res.status(200).json({
        success: true,
        message: "Booking created successfully",
        data: result,
      });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const {  role } = req.user!;
    const userId = req.user!.id;

    console.log(userId, role,req.user!.id);

    const result = await bookingService.getBookings(role, userId);

    if (role === "admin") {
      const getByAdmin = result.rows!.map((b) => ({
        id: b.id,
        customer_id: b.customer_id,
        vehicle_id: b.vehicle_id,
        rent_start_date: b.rent_start_date,
        rent_end_date: b.rent_end_date,
        total_price: b.total_price,
        status: b.status,
        customer: {
          name: b.customer_name,
          email: b.customer_email,
        },
        vehicle: {
          vehicle_name: b.vehicle_name,
          registration_number: b.registration_number,
        },
      }));

      const bookings = getByAdmin.map((booking) => ({
        ...booking,
        total_price: Number(booking.total_price),
      }));

      const data = bookings.map((booking) => ({
        ...booking,
        rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
        rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
      }));

      return res.status(200).json({
        success: true,
        message: "Bookings retrieved successfully",
        data: data,
      });
    }

    const getByCustomer = result.rows.map((b) => ({
      id: b.id,
      vehicle_id: b.vehicle_id,
      rent_start_date: b.rent_start_date,
      rent_end_date: b.rent_end_date,
      total_price: b.total_price,
      status: b.status,
      vehicle: {
        vehicle_name: b.vehicle_name,
        registration_number: b.registration_number,
        type: b.type,
      },
    }));

    console.log(getByCustomer);

    const userBookings = getByCustomer.map((booking) => ({
      ...booking,
      total_price: Number(booking.total_price),
    }));

    const userData = userBookings.map((booking) => ({
      ...booking,
      rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
      rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
    }));

    return res.status(200).json({
      success: true,
      message: "Your bookings retrieved successfully",
      data: userData, 
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
};
