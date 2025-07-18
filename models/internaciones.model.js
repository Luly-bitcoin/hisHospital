import pool from '../config/db.js';

export async function obtenerPacientesDisponibles() {
  const [result] = await pool.query(`
    SELECT p.id, p.nombre_completo
    FROM pacientes p
    WHERE NOT EXISTS (
      SELECT 1 FROM internaciones i
      WHERE i.dni_pacientes = p.id AND i.fecha_egreso IS NULL
    )
  `);
  return result;
}

export async function asignarPacienteACama(camaId, pacienteId, tipo_ingreso) {
  const [rows] = await pool.query('SELECT estado FROM camas WHERE id = ?', [camaId]);

  if (rows.length === 0) throw new Error('Cama no encontrada');

  const cama = rows[0];

  if (cama.estado !== 'libre') throw new Error('Cama no disponible');

  const fechaIngreso = new Date();

  await pool.query(
    `INSERT INTO internaciones (dni_pacientes, id_cama, tipo_ingreso, fecha_ingreso, observaciones) VALUES (?, ?, ?, ?, ?)`,
    [pacienteId, camaId, tipo_ingreso, fechaIngreso, '']
  );

  await pool.query('UPDATE camas SET estado = ? WHERE id = ?', ['ocupada', camaId]);
}


export async function egresarPaciente(pacienteId) {
  const fechaEgreso = new Date();

  const [internacion] = await pool.query(`
    SELECT id_cama FROM internaciones
    WHERE dni_pacientes = ? AND fecha_egreso IS NULL
  `, [pacienteId]);

  if (internacion.length === 0) throw new Error('No hay internación activa');

  const camaId = internacion[0].id_cama;

  await pool.query(`
    UPDATE internaciones
    SET fecha_egreso = ?
    WHERE dni_pacientes = ? AND fecha_egreso IS NULL
  `, [fechaEgreso, pacienteId]);

  await pool.query(`
    UPDATE camas
    SET estado = 'higienizando'
    WHERE id = ?
  `, [camaId]);
}

