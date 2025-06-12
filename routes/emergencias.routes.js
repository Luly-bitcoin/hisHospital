import express from 'express';
import { vistaEmergencias, guardarEmergencia } from '../controllers/emergencias.controller.js';

const router = express.Router();

router.get('/', vistaEmergencias);
router.post('/guardar', guardarEmergencia);

export default router;
