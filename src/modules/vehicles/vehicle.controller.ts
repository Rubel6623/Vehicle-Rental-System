import express, { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';

const createVehicle = async(req: Request, res: Response)=>{

  try {
    const result = await vehicleService.createVehicle(req.body);

    delete result.rows[0].created_at;
    delete result.rows[0].updated_at;

    res.status(200).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0]
    })

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

export const vehicleController = {
  createVehicle,
  getVehicles,
}