let pacientesGlobal = [];

async function cargarPacientesInternados() {
  const res = await fetch('/internados');
  pacientesGlobal = await res.json();
  renderizarPacientes(pacientesGlobal);
}

function renderizarPacientes(pacientes) {
  const lista = document.getElementById('internados-lista');
  lista.innerHTML = '';

  if (pacientes.length === 0) {
    lista.innerHTML = '<tr><td colspan="7">No hay pacientes internados actualmente.</td></tr>';
    return;
  }

  pacientes.forEach(p => {
    const fila = document.createElement('tr');
    fila.id = `fila-${p.internacion_id}`;
    fila.innerHTML = `
      <td>${p.nombre_completo}</td>
      <td>${p.dni}</td>
      <td>${p.cama_codigo}</td>
      <td>${p.habitacion_numero}</td>
      <td>${p.ala_nombre}</td>
      <td>${new Date(p.fecha_asignacion).toLocaleString()}</td>
      <td><button onclick="darAlta(${p.internacion_id}, ${p.cama_id})">Dar Alta</button></td>
    `;
    lista.appendChild(fila);
  });
}

async function darAlta(internacionId, camaId) {
  const confirmacion = confirm('¿Dar de alta al paciente?');
  if (!confirmacion) return;

  const res = await fetch('/dar-alta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ internacion_id: internacionId, cama_id: camaId })
  });

  const data = await res.json();
  alert(data.mensaje);

  const fila = document.getElementById(`fila-${internacionId}`);
  fila.classList.add('desaparecer');
  setTimeout(() => fila.remove(), 500);
}

document.getElementById('buscador').addEventListener('input', (e) => {
  const termino = e.target.value.toLowerCase();
  const filtrados = pacientesGlobal.filter(p =>
    p.nombre_completo.toLowerCase().includes(termino) || p.dni.toLowerCase().includes(termino)
  );
  renderizarPacientes(filtrados);
});

window.onload = cargarPacientesInternados;
