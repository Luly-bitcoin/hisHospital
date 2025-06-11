import { obtenerAlasConCamas } from '../models/camas.model.js';
import { obtenerPacientes } from '../models/pacientes.model.js';

export const vistaAsignarCama = async (req, res) => {
  try {
    const alas = await obtenerAlasConCamas();
    const pacientes = await obtenerPacientes(); // ← importante
    res.render('asignar_cama', { alas, pacientes }); // ← debe pasar "pacientes"
  } catch (error) {
    console.error('Error al cargar la vista:', error);
    res.status(500).send('Error interno del servidor');
  }
};
