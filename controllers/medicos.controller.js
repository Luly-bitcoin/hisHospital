import pool from '../config/db.js';

export const listarMedicos = async (req, res) => {
  try {
    const [medicos] = await pool.query('SELECT * FROM medicos WHERE estado = 1');
    res.render('lista_medicos', { medicos });
  } catch (error) {
    console.error('Error al listar médicos:', error);
    res.status(500).send('Error al obtener médicos');
  }
};

export const mostrarFormularioAgregar = (req, res) => {
  res.render('agregar_medico'); 
};

export const agregarMedico = async (req, res) => {
  try {
    const { nombre, correo, sexo, matricula, dni, especialidad } = req.body;
    await pool.query(
      'INSERT INTO medicos (nombre, correo, sexo, matricula, dni, especialidad) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, correo, sexo, matricula, dni, especialidad]
    );
    res.redirect('/medicos/lista');
  } catch (error) {
    console.error('Error al agregar médico:', error);
    res.status(500).send('Error al agregar médico');
  }
};

export const mostrarFormularioEditar = async (req, res) => {
  try {
    const dni = req.params.dni;
    const [result] = await pool.query('SELECT * FROM medicos WHERE dni = ?', [dni]);
    if (result.length === 0) {
      return res.status(404).send('Médico no encontrado');
    }
    res.render('editar_medico', { medico: result[0] });
  } catch (error) {
    console.error('Error al cargar médico:', error);
    res.status(500).send('Error interno');
  }
};


export const editarMedico = async (req, res) => {
  try {
    const dni = req.params.dni;
    const { nombre, correo, sexo, matricula, especialidad } = req.body;
    await pool.query(
      'UPDATE medicos SET nombre = ?, correo = ?, sexo = ?, matricula = ?, especialidad = ? WHERE dni = ?',
      [nombre, correo, sexo, matricula, especialidad, dni]
    );
    res.redirect('/medicos/lista');
  } catch (error) {
    console.error('Error al editar médico:', error);
    res.status(500).send('Error al editar médico');
  }
};

export const eliminarMedico = async (req, res) => {
  try {
    const { dni } = req.params;
    await pool.query('UPDATE medicos SET estado = 0 WHERE dni = ?', [dni]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar médico:', error);
    res.status(500).send('Error al eliminar médico');
  }
};
