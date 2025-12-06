import express, { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    const users = result.rows.map(({ password, created_at, updated_at, ...user }) => user);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const updateUser = async(req:Request, res:Response)=>{
  const { name, email, phone, role } = req.body;

  try {
    const result = await userServices.updateUser(name, email,phone,role, req.params.id!);

    const { password, created_at, updated_at, ...userData } = result.rows[0];

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: userData,
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


export const userControllers = {
  createUser,
  getUser,
  updateUser,
};
