import { Router } from 'express';
import {
  obtenerPacientesInternados,
  darAltaPaciente,
  obtenerPacientesEmergencia,
  darAltaEmergencia,
  asignarDniReal
} from '../controllers/internaciones.controller.js';

const router = Router();

router.get('/internados', obtenerPacientesInternados);
router.post('/dar-alta', darAltaPaciente);

router.get('/emergencia', obtenerPacientesEmergencia);
router.post('/alta-emergencia', darAltaEmergencia);
router.post('/asignar-dni', asignarDniReal);

router.get('/pacientes-internados', (req, res) => {
  res.render('pacientes-internados');
});

export default router;
