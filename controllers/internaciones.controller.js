// internaciones.controller.js
import pool from '../config/db.js';

export async function obtenerPacientesInternados(req, res) {
  try {
    const [pacientes] = await pool.query(`
      SELECT 
        p.nombre_completo, p.dni,
        a.nombre AS ala_nombre,
        h.id AS id_habitacion,
        c.id AS id_cama,
        i.id AS internacion_id,
        c.id AS cama_id,
        i.fecha_ingreso
      FROM internaciones i
      JOIN pacientes p ON p.dni = i.dni_pacientes
      JOIN camas c ON c.id = i.id_cama
      JOIN habitaciones h ON h.id = c.habitacion_id
      JOIN alas a ON a.id = h.ala_id
      WHERE i.fecha_egreso IS NULL
    `);
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes internados' });
  }
}

export async function darAltaPaciente(req, res) {
  const { internacion_id, cama_id } = req.body;

  try {
    await pool.query(
      'UPDATE internaciones SET fecha_egreso = NOW() WHERE id = ?',
      [internacion_id]
    );

    await pool.query(
      'UPDATE camas SET estado = "higienizando" WHERE id = ?',
      [cama_id]
    );

    res.status(200).json({ mensaje: 'Paciente dado de alta correctamente.' });
  } catch (error) {
    console.error('Error al dar de alta al paciente:', error);
    res.status(500).json({ mensaje: 'Error al dar de alta al paciente.' });
  }
}

export async function obtenerPacientesEmergencia(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id_emergencia,
        e.dni_falso,
        e.fecha_ingreso,
        e.id_cama,
        e.observacion
      FROM emergencias e
      JOIN camas c ON e.id_cama = c.id
      JOIN habitaciones h ON c.habitacion_id = h.id
      JOIN alas a ON h.ala_id = a.id
      WHERE a.nombre = 'Emergencias' AND e.fecha_egreso IS NULL
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener pacientes en emergencia' });
  }
}

// Nueva función para dar alta en emergencia
export async function darAltaEmergencia(req, res) {
  const { emergencia_id, cama_id } = req.body;

  try {
    await pool.query(
      'UPDATE emergencias SET fecha_egreso = NOW() WHERE id = ? AND cama_id = ?',
      [emergencia_id, cama_id]
    );

    await pool.query(
      'UPDATE camas_emergencia SET estado = "higienizando" WHERE id = ?',
      [cama_id]
    );

    res.json({ mensaje: 'Paciente dado de alta de emergencia correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al dar alta de emergencia' });
  }
}
