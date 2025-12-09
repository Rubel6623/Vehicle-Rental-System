import express, { Request, Response } from "express";
import { userServices } from "./user.service";


const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
};

const getSingleUser= async(req:Request, res:Response)=>{

  try {
    const result = await userServices.getSingleUser(req.params.id as string);

    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
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

const updateUser = async(req:Request, res:Response)=>{
  const { name, email, phone, role } = req.body;

  const updateUserId = req.params.id!;
  const loggedInUserId = req.user?.id;
  const userRole = req.user?.role;

  try {

    if (!userRole) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request.",
    });
  }

    if (userRole !== "admin" && loggedInUserId !== updateUserId) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own profile.",
      });
    }

    let setRole = role;
    if(userRole !== "admin"){
      setRole = undefined; 
    }

    const result = await userServices.updateUser(name, email,phone,setRole, updateUserId);

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

const deleteUser = async(req:Request, res:Response)=>{

  try {
    const result = await userServices.deleteUser(req.params.id!);

    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "User not found..."
      })
    }else{
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
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


export const userControllers = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
