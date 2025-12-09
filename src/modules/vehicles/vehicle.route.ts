import express from 'express';
import { vehicleController } from './vehicle.controller';
import auth from '../../middleware/auth';
import { Roles } from '../auth/auth.constant';

const router = express.Router();

router.post("/", auth(Roles.admin), vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getSingleVehicle);
router.put("/:id",  vehicleController.updateVehicle);
router.delete("/:id",auth(Roles.admin), vehicleController.deleteVehicle);

export const vehicleRouter = router;