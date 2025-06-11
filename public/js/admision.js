fetch('/admision/agregar-paciente', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(res => {
    if (!res.ok) throw new Error('Respuesta no OK');
    return res.json();
  })
  .then(data => console.log(data))
  .catch(error => {
    console.error('Error inesperado:', error);
  });
