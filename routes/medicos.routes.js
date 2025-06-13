import { Router } from 'express';
import {
  listarMedicos,
  mostrarFormularioAgregar,
  agregarMedico,
  mostrarFormularioEditar,
  editarMedico,
  eliminarMedico,
} from '../controllers/medicos.controller.js';

const router = Router();

router.get('/lista', listarMedicos);

router.get('/nuevo', mostrarFormularioAgregar);

router.post('/nuevo', agregarMedico);

router.get('/editar/:dni', mostrarFormularioEditar);

router.post('/editar/:dni', editarMedico);

router.delete('/eliminar/:dni', eliminarMedico);

export default router;
