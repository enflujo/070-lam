export function crearParrafos(texto, contenedor) {
  contenedor.innerHTML = '';
  if (!texto) return;
  const partesDesc = texto.split('\n').filter((parte) => parte.length);

  partesDesc.forEach((parte) => {
    const parrafo = document.createElement('p');
    parrafo.innerText = parte;
    contenedor.appendChild(parrafo);
  });
}
