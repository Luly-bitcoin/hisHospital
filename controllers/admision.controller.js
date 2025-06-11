import pool from '../config/db.js';

export const mostrarFormulario = (req, res) => {
  res.render('admision');
};

export const registrarPaciente = async (req, res) => {
  const { nombre, dni, fecha_nacimiento, sexo, motivo } = req.body;
  try {
    const [rows] = await pool.query(
      'INSERT INTO pacientes (nombre, dni, fecha_nacimiento, sexo, motivo_internacion) VALUES (?, ?, ?, ?, ?)',
      [nombre, dni, fecha_nacimiento, sexo, motivo]
    );
    res.send('Paciente registrado correctamente.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el paciente');
  }
};
