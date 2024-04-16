// src/routes/doctorRoutes.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { DoctorProfileController } from '../controllers/DoctorProfileController';

const doctorRouter = Router();
const doctorProfileController = container.resolve(DoctorProfileController);

doctorRouter.post('/doctor', doctorProfileController.createDoctor);
doctorRouter.get('/doctors', doctorProfileController.getAllDoctors);

export default doctorRouter;
