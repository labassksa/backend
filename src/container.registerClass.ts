import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthService } from './api_labass/services/AuthService';
import { OTPService } from './api_labass/services/OTPService';

// Register services
container.registerSingleton('AuthService', AuthService);
container.registerSingleton('OTPService', OTPService);
