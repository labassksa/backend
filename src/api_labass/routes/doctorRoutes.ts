// src/routes/doctorRoutes.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { DoctorProfileController } from '../controllers/doctorProfileController';

const doctorRouter = Router();
const doctorProfileController = container.resolve(DoctorProfileController);

doctorRouter.post('/doctor', doctorProfileController.createDoctor);
doctorRouter.get('/doctors', doctorProfileController.getAllDoctors);

export default doctorRouter;
