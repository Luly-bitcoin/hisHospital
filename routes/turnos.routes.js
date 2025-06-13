import { Router } from 'express';
import {
  mostrarFormularioTurno,
  registrarTurno,
  listarTurnos
} from '../controllers/turnos.controller.js';

const router = Router();

router.get('/nuevo', mostrarFormularioTurno);
router.post('/registrar', registrarTurno);
router.get('/', listarTurnos);

export default router;
