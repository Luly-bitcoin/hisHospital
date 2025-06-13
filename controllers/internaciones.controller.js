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

export async function darAltaEmergencia(req, res) {
  const {id_emergencia, cama_id} = req.body;
  console.log('BODY: ', req.body);

  if(!id_emergencia || !cama_id){
    return res.status(400).json({mensaje: 'faltan datos'});
  }

  const emergencia_id = Number(id_emergencia);
  const idCama = Number(cama_id);

  if(isNaN(emergencia_id) || isNaN(idCama)){
    return res.status(400).json({mensaje: 'datos invalidos'});
  }

  console.log('Datos recibidos: ', {emergencia_id, idCama});
  try {
    const [updateEmergencia] = await pool.query(
      'UPDATE emergencias SET fecha_egreso = NOW() WHERE id_emergencia = ? AND id_cama = ? AND fecha_egreso IS NULL',
      [emergencia_id, idCama]
    );

    const [updateCama] = await pool.query(
      'UPDATE camas SET estado = "higienizando" WHERE id = ?',
      [idCama]
    );

    console.log('filas afectadas: ', updateEmergencia.affectedRows);
    console.log('Cama actualizada: ', updateCama.affectedRows);

    res.json({ mensaje: 'Paciente dado de alta de emergencia correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al dar alta de emergencia' });
  }
}

export async function asignarDniReal(req, res) {
  const { id_emergencia, nuevo_dni } = req.body;

  console.log("datos recibidos en asignar dni real: ", req.body);

  if(!id_emergencia || !nuevo_dni){
    return res.status(500).json({error: 'faltan datos'});
  }
  if(isNaN(nuevo_dni)){
    return res.status(400).json({error: 'dni invalido'});
  }

  try {
    const [pacientes] = await pool.query(
      'SELECT * FROM pacientes WHERE dni = ?',
      [nuevo_dni]
    );

    if (pacientes.length === 0) {
      return res.status(400).json({ error: 'El DNI ingresado no existe en la base de pacientes.' });
    }

    await pool.query(
      'UPDATE emergencias SET dni_falso = ? WHERE id_emergencia = ?',
      [nuevo_dni, id_emergencia]
    );

    res.json({ mensaje: 'DNI real asignado correctamente.' });
  } catch (error) {
    console.error('Error al asignar DNI real:', error);
    res.status(500).json({ error: 'Error interno al asignar el DNI.' });
  }
}
