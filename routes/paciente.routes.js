import { Router } from 'express';
import { obtenerPacientesDisponibles } from '../controllers/pacientes.controller.js';

const router = Router();

router.get('/disponibles', obtenerPacientesDisponibles);

export default router;
