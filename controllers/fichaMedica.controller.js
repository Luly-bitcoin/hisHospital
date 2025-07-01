// controllers/fichaMedica.controller.js
import pool from '../config/db.js';

export async function vistaFichaMedica(req, res) {
  const { evaluacionId } = req.params;

  try {
    // Traer el historial médico (si existe)
    const [rows] = await pool.query(
      'SELECT * FROM historial_medico WHERE evaluacion_id = ?',
      [evaluacionId]
    );
    const historial = rows.length > 0 ? rows[0] : {};

    // Traer datos del paciente y del médico
    const [datosPaciente] = await pool.query(`
      SELECT p.nombre_completo AS nombre_paciente, p.dni AS dni_paciente,
             m.nombre AS nombre_medico
      FROM evaluaciones_enfermeria ev
      JOIN pacientes p ON ev.dni_paciente = p.dni
      JOIN medicos m ON ev.dni_medico = m.dni
      WHERE ev.id = ?
    `, [evaluacionId]);

    if (datosPaciente.length === 0) {
      return res.status(404).send("Evaluación no encontrada");
    }

    const paciente = datosPaciente[0];

    // Renderizar la vista con todos los datos
    res.render('ficha-medica', {
      evaluacionId,
      nombre_paciente: paciente.nombre_paciente,
      dni_paciente: paciente.dni_paciente,
      nombre_medico: paciente.nombre_medico,
      enfermedades_previas: historial.enfermedades_previas || '',
      cirugias_previas: historial.cirugias_previas || '',
      alergias: historial.alergias || '',
      medicamentos_actuales: historial.medicamentos_actuales || '',
      antecedentes_familiares: historial.antecedentes_familiares || '',
      referer: req.get('referer') || '/pacientes-internados'
    });

  } catch (error) {
    console.error('Error al cargar ficha médica:', error);
    res.status(500).send('Error interno al cargar la ficha médica');
  }
}


export async function guardarFichaMedica(req, res) {
  const { evaluacionId } = req.params;
  const {
    enfermedades_previas,
    cirugias_previas,
    alergias,
    medicamentos_actuales,
    antecedentes_familiares,
    motivo,
    sintomas,
    observaciones,
    intervenciones,
    medicamentos,
    comunicacion,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    observaciones_signos,
    redirectTo
  } = req.body;

  try {
    // historial_medico
    const [historial] = await pool.query('SELECT * FROM historial_medico WHERE evaluacion_id = ?', [evaluacionId]);
    if (historial.length > 0) {
      await pool.query(
        `UPDATE historial_medico SET
          enfermedades_previas = ?, cirugias_previas = ?, alergias = ?,
          medicamentos_actuales = ?, antecedentes_familiares = ?
         WHERE evaluacion_id = ?`,
        [enfermedades_previas, cirugias_previas, alergias, medicamentos_actuales, antecedentes_familiares, evaluacionId]
      );
    } else {
      await pool.query(
        `INSERT INTO historial_medico (
          evaluacion_id, enfermedades_previas, cirugias_previas,
          alergias, medicamentos_actuales, antecedentes_familiares
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [evaluacionId, enfermedades_previas, cirugias_previas, alergias, medicamentos_actuales, antecedentes_familiares]
      );
    }

    // motivo_internacion
    const [motivoExistente] = await pool.query('SELECT * FROM motivo_internacion WHERE evaluacion_id = ?', [evaluacionId]);
    if (motivoExistente.length > 0) {
      await pool.query(
        'UPDATE motivo_internacion SET motivo = ?, sintomas = ? WHERE evaluacion_id = ?',
        [motivo, sintomas, evaluacionId]
      );
    } else {
      await pool.query(
        'INSERT INTO motivo_internacion (evaluacion_id, motivo, sintomas) VALUES (?, ?, ?)',
        [evaluacionId, motivo, sintomas]
      );
    }

    // observaciones_generales
    const [obsGen] = await pool.query('SELECT * FROM observaciones_generales WHERE evaluacion_id = ?', [evaluacionId]);
    if (obsGen.length > 0) {
      await pool.query('UPDATE observaciones_generales SET observaciones = ? WHERE evaluacion_id = ?', [observaciones, evaluacionId]);
    } else {
      await pool.query('INSERT INTO observaciones_generales (evaluacion_id, observaciones) VALUES (?, ?)', [evaluacionId, observaciones]);
    }

    // plan_cuidados
    const [cuidados] = await pool.query('SELECT * FROM plan_cuidados WHERE evaluacion_id = ?', [evaluacionId]);
    if (cuidados.length > 0) {
      await pool.query(
        'UPDATE plan_cuidados SET intervenciones = ?, medicamentos = ?, comunicacion = ? WHERE evaluacion_id = ?',
        [intervenciones, medicamentos, comunicacion, evaluacionId]
      );
    } else {
      await pool.query(
        'INSERT INTO plan_cuidados (evaluacion_id, intervenciones, medicamentos, comunicacion) VALUES (?, ?, ?, ?)',
        [evaluacionId, intervenciones, medicamentos, comunicacion]
      );
    }

    // signos_vitales
    const [signos] = await pool.query('SELECT * FROM signos_vitales WHERE evaluacion_id = ?', [evaluacionId]);
    if (signos.length > 0) {
      await pool.query(
        `UPDATE signos_vitales SET 
          presion_arterial = ?, frecuencia_cardiaca = ?, frecuencia_respiratoria = ?,
          temperatura = ?, observaciones = ?
        WHERE evaluacion_id = ?`,
        [presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, observaciones_signos, evaluacionId]
      );
    } else {
      await pool.query(
        `INSERT INTO signos_vitales (
          evaluacion_id, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria,
          temperatura, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [evaluacionId, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, observaciones_signos]
      );
    }
    
    return res.redirect(redirectTo || '/pacientes-internados');

  } catch (error) {
    console.error('❌ Error al guardar ficha médica:', error);
    if (!res.headersSent) {
      return res.status(500).send('Error al guardar la ficha médica');
    }
  }
}
