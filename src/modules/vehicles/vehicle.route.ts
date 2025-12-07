import express from 'express';
import { vehicleController } from './vehicle.controller';

const router = express.Router();

router.post("/", vehicleController.createVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getSingleVehicle);
router.put("/:id", vehicleController.updateVehicle);

export const vehicleRouter = router;