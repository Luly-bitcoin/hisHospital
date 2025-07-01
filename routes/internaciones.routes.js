import pool from '../config/db.js';
import { Router } from 'express';
import {
  obtenerPacientesInternados,
  darAltaPaciente,
  obtenerPacientesEmergencia,
  darAltaEmergencia,
  asignarDniReal,
  obtenerHistorialMedico,
  guardarHistorialMedico
} from '../controllers/internaciones.controller.js';
import { guardarFichaMedica, vistaFichaMedica } from '../controllers/fichaMedica.controller.js';

const router = Router();

router.get('/internados', obtenerPacientesInternados);
router.post('/dar-alta', darAltaPaciente);

router.get('/emergencia', obtenerPacientesEmergencia);
router.post('/alta-emergencia', darAltaEmergencia);
router.post('/asignar-dni', asignarDniReal);

router.get('/pacientes-internados', (req, res) => {
  res.render('pacientes-internados');
});

router.get('/internaciones', (req, res) =>{
  res.redirect('/internaciones/pacientes-internados')
})

router.get('/historial-medico/:evaluacionId', obtenerHistorialMedico);
router.post('/historial-medico', guardarHistorialMedico);

router.get('/ficha-medica/editar/:evaluacionId', vistaFichaMedica);
router.post('/ficha-medica/editar/:evaluacionId', guardarFichaMedica);

router.post('/evaluaciones/crear', async (req, res) => {
  const { internacion_id, dni_paciente, dni_medico } = req.body;

  if (!internacion_id || !dni_paciente || !dni_medico) {
    return res.status(400).json({ mensaje: 'Faltan datos para crear la evaluación.' });
  }

  try {
    const [resultado] = await pool.query(
      'INSERT INTO evaluaciones_enfermeria (internacion_id, dni_paciente, dni_medico, fecha) VALUES (?, ?, ?, NOW())',
      [internacion_id, dni_paciente, dni_medico]
    );

    const evaluacionId = resultado.insertId;

    res.json({ mensaje: 'Evaluación creada correctamente', evaluacion_id: evaluacionId });
  } catch (error) {
    console.error('❌ Error al crear evaluación:', error); // Esto es clave
    res.status(500).json({ mensaje: 'Error al crear evaluación' });
  }
});


export default router;
