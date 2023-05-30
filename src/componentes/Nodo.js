const DOS_PI = Math.PI * 2;
const centro = { x: 50, y: 50 };

export default class Nodo {
  constructor(contenedor, nombreAgente, anillo) {
    this.grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const icono = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const nodoTexto = document.createTextNode(nombreAgente);

    texto.setAttribute('class', 'nombre');
    texto.appendChild(nodoTexto);
    icono.setAttribute('fill', '#d53f26');
    icono.setAttribute('r', 1);
    icono.fill = 'red';

    this.radio = anillo * 10;
    this.angulo = (Math.random() * 360) | 0;

    this.grupo.appendChild(icono);
    this.grupo.appendChild(texto);

    contenedor.appendChild(this.grupo);
    this.actualizar();
  }

  actualizar() {
    this.angulo = (this.angulo + 0.1) % 360;
    const _x = this.radio * Math.sin((DOS_PI * this.angulo) / 360);
    const _y = this.radio * Math.cos((DOS_PI * this.angulo) / 360);
    const x = centro.x + _x;
    const y = centro.x + _y;
    this.grupo.setAttribute('transform', `translate(${x},${y})`);
  }
}
