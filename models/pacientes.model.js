import pool from '../config/db.js';

export async function obtenerPacientes() {
  try {
    const [rows] = await pool.query('SELECT dni, nombre_completo FROM pacientes');
    return rows;
  } catch (error) {
    console.error('Error en obtenerPacientes:', error);
    throw error;
  }
}
