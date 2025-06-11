import express from 'express';
import pool from '../config/db.js';
import { mostrarFormulario, registrarPaciente } from '../controllers/admision.controller.js';

const router = express.Router();

router.get('/', mostrarFormulario);
router.post('/registrar', registrarPaciente);

router.get('/verificar-dni/:dni', async (req, res) => {
  const dni = req.params.dni;
  try {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
    if (rows.length > 0) {
      res.json({ existe: true, paciente: rows[0] });
    } else {
      res.json({ existe: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

router.post('/agregar-paciente', async (req, res) => {
    const {
        dni,
        nombre,
        fecha,
        direcc,
        contacto,
        sexo,
        telefono,
        localidad,
        obra_social
        } = req.body;

        try {
        const [existe] = await pool.query('SELECT * FROM pacientes WHERE dni = ?', [dni]);
        if (existe.length > 0) {
            return res.json({ ok: false, error: 'El paciente ya existe' });
        }

        await pool.query(
            `INSERT INTO pacientes 
            (dni, nombre_completo, fecha_nacimiento, direccion, contacto_emergencia, sexo, telefono, localidad, obra_social) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [dni, nombre, fecha, direcc, contacto, sexo, telefono, localidad, obra_social]
        );

        res.json({ ok: true });
        } catch (error) {
        console.error(error);
        res.json({ ok: false, error: 'Error al insertar paciente' });
        }

        });

export default router;
