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

export async function asignarPacienteACama(camaId, pacienteId) {
  const [cama] = await pool.query('SELECT estado FROM camas WHERE id = ?', [camaId]);
  if (cama.length === 0) throw new Error('Cama no encontrada');
  if (cama[0].estado !== 'libre') throw new Error('Cama no disponible');

  const fechaIngreso = new Date(); 
  await pool.query(
    `INSERT INTO internaciones (dni_pacientes, id_cama, tipo_ingreso, fecha_ingreso) VALUES (?, ?, ?, ?)`,
    [pacienteId, camaId, 'guardia', fechaIngreso]
  );

  await pool.query('UPDATE camas SET estado = ? WHERE id = ?', ['ocupada', camaId]);
}