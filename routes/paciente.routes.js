import { Router } from 'express';
import { obtenerPacientesDisponibles } from '../controllers/pacientes.controller.js';

const router = Router();

router.get('/disponibles', obtenerPacientesDisponibles);

router.get('/buscar/:dni', async (req, res) => {
  const dni = req.params.dni;
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
    if (rows.length > 0) {
      res.json({ existe: true, paciente: rows[0] });
    } else {
      res.json({ existe: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar paciente' });
  }
});


export default router;
