import express, { Request, Response } from 'express';
import { vehicleService } from './vehicle.service';

const createVehicle = async(req: Request, res: Response)=>{

  try {
    const result = await vehicleService.createVehicle(req.body);

    result.rows[0].daily_rent_price = Number(result.rows[0].daily_rent_price);

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

    result.rows = result.rows.map((vehicle) => ({
      ...vehicle,
      daily_rent_price: Number(vehicle.daily_rent_price),
    }));

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

const getSingleVehicle= async(req:Request, res:Response)=>{

  try {
    const result = await vehicleService.getSingleVehicle(req.params.id as string);
    
    result.rows[0].daily_rent_price = Number(result.rows[0].daily_rent_price);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "Vehicle not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
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
}

const updateVehicle = async(req:Request, res:Response)=>{

  const {vehicle_name, type,registration_number, daily_rent_price, availability_status} = req.body;

  try {
    const result = await vehicleService.updateVehicle(vehicle_name, type,registration_number, daily_rent_price, availability_status, req.params.id as string);
    
    result.rows[0].daily_rent_price = Number(result.rows[0].daily_rent_price);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "Vehicle not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "Vehicle Updated Successfully",
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
};

const deleteVehicle = async(req:Request, res:Response)=>{

  try {
    const result = await vehicleService.deleteVehicle(req.params.id!);

    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "Vehicle not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
      })
    }

  } catch (err:any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err
    })
  }
};

export const vehicleController = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle
}