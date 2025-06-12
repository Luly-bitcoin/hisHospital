import express from 'express';
import { obtenerAlasConCamas } from '../models/camas.model.js';
import { obtenerPacientesDisponibles } from '../models/internaciones.model.js';
import { asignarPacienteACama } from '../models/internaciones.model.js';
import { vistaAsignarCama } from '../controllers/cama.controller.js';

const router = express.Router();

router.get('/asignar_cama', vistaAsignarCama);

router.get('/pacientes-disponibles', async (req, res) => {
  try {
    const pacientes = await obtenerPacientesDisponibles();
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
});

router.post('/asignar-paciente', async (req, res) => {
  try {
    console.log('Datos recibidos: ', req.body);
    const { camaId, pacienteId, tipo_ingreso } = req.body;
    console.log('Asignando paciente:', pacienteId, 'a cama:', camaId);
    
    await asignarPacienteACama(camaId, pacienteId, tipo_ingreso);
    res.status(200).send('Asignación exitosa');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al asignar paciente');
  }
});


router.get('/asignar_cama', async (req, res) => {
  try {
    const alas = await obtenerAlasConCamas();
    console.log(JSON.stringify(alas, null, 2));
    res.render('asignar_cama', { alas });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener camas');
  }
});

export default router;
