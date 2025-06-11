import pool from '../config/db.js';

export async function obtenerAlasConCamas() {
  const [alas] = await pool.query('SELECT * FROM alas');
  const [habitaciones] = await pool.query('SELECT * FROM habitaciones');
  const [camas] = await pool.query('SELECT * FROM camas');

  const resultado = alas.map(ala => {
    const habitacionesDeAla = habitaciones
      .filter(h => h.ala_id === ala.id)
      .map(habitacion => {
        const camasDeHabitacion = camas.filter(c => c.habitacion_id === habitacion.id);
        return { ...habitacion, camas: camasDeHabitacion };
      });
    return { ...ala, habitaciones: habitacionesDeAla };
  });

  return resultado;
}

