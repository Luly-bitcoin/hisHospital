import pool from '../config/db.js';

export const mostrarFormularioTurno = async (req, res) => {
  try {
    const [medicos] = await pool.query('SELECT dni, nombre, especialidad FROM medicos');
    res.render('turnos', { medicos });
  } catch (error) {
    console.error('Error al cargar médicos:', error);
    res.status(500).send('Error interno');
  }
};

export const registrarTurno = async (req, res) => {
  try {
    const {
      dni_paciente,
      nombre_paciente,
      obra_social,
      telefono_contacto,
      fecha_turno,
      hora_turno,
      especialidad,
      motivo,
      tipo_turno = 'pendiente',
      dni_medico
    } = req.body;



    await pool.query(`
      INSERT INTO turnos (
        dni_paciente, nombre_paciente, obra_social, telefono_contacto,
        fecha_turno, hora_turno, especialidad, motivo, tipo_turno, dni_medico
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dni_paciente,
      nombre_paciente,
      obra_social,
      telefono_contacto,
      fecha_turno,
      hora_turno,
      especialidad,
      motivo,
      tipo_turno,
      dni_medico
    ]);

    res.redirect('/turnos');
  } catch (error) {
    console.error('Error al guardar el turno:', error);
    res.status(500).send('Error interno al guardar el turno');
  }
};

export const listarTurnos = async (req, res) => {
  try {
    const [turnos] = await pool.query('SELECT * FROM turnos ORDER BY fecha_turno, hora_turno');
    res.render('lista_turnos', { turnos });
  } catch (error) {
    console.error('Error al listar los turnos:', error);
    res.status(500).send('Error al listar turnos');
  }
};
