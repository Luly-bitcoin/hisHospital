import  pool  from '../config/db.js';
import { v4 as uuidv4 } from 'uuid'; 

export async function vistaEmergencias(req, res) {
  const [camas] = await pool.query(`
    SELECT c.id, CONCAT('Cama ', c.id) AS nombre
    FROM camas c
    JOIN habitaciones h ON c.habitacion_id = h.id
    JOIN alas a ON h.ala_id = a.id
    WHERE a.nombre = 'Emergencias'
    AND c.estado = 'libre'
  `);

  
  res.render('emergencias', { camasEmergencia: camas });
}

export async function guardarEmergencia(req, res) {
  const { id_cama, sexo, observacion } = req.body;

  if (!id_cama || !observacion || !sexo) {
    return res.status(400).send("Faltan campos obligatorios.");
  }

  const dniFalso = 'EMERG-' + uuidv4().slice(0, 8).toUpperCase(); 
  const fechaIngreso = new Date();
  const fechaStr = fechaIngreso.toISOString().slice(0, 19).replace('T', ' ');

  try {
    await pool.query(`
      INSERT INTO emergencias (dni_falso, id_cama, fecha_ingreso, sexo, observacion)
      VALUES (?, ?, ?, ?, ?)
    `, [dniFalso, id_cama, fechaStr, sexo, observacion]);

    await pool.query(`
      UPDATE camas SET estado = 'ocupada' WHERE id = ?
    `, [id_cama]);


    res.redirect('/emergencias');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar emergencia.");
  }
}
