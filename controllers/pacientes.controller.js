import { obtenerPacientes } from '../models/pacientes.model.js';

export async function obtenerPacientesDisponibles(req, res) {
  try {
    const pacientes = await obtenerPacientes();
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ mensaje: 'Error al obtener pacientes' });
  }
}
