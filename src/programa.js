import Nodo from './componentes/Nodo';
import './scss/estilos.scss';
import datosAgentes from './Visualización LAM - agentes.csv';
import datosEstructurados from './Visualización LAM - prueba-datos-estructurados.csv';
import metadatos from './Visualización LAM - prueba-metadatos.csv';
// import personas from './Visualización LAM - personas.csv';
// import organizaciones from './Visualización LAM - organizaciones';

let datos;

const nodos = [];
const svg = document.getElementById('vis');
const listaCirculos = document.getElementById('listaCirculos');

const losQueSeMuestran = datosEstructurados.filter((agente) => agente['se muestra']);
const circulos = metadatos.filter((fila) => fila.circulos && fila.circulos.length);
const agentes = datosAgentes.filter((agente) => agente.se_muestra === 'TRUE');

function procesarDatos() {
  const campos = Object.keys(datosEstructurados[0]);

  datos = datosEstructurados.map((instancia) => {
    for (const campo of campos) {
      const dato = instancia[campo];

      if (dato) {
        instancia[campo] = dato.trim();

        if (dato === 'FALSE') {
          instancia[campo] = false;
        }

        if (dato === 'TRUE') {
          instancia[campo] = true;
        }
      }
    }

    return instancia;
  });
}

procesarDatos();
crearNodos();
animar();

function crearNodos() {
  console.log(agentes);
  agentes.forEach((agente) => {
    if (agente.agentes !== 'Lazos de amor mariano') {
      const anillo = +agente.grado.slice(-1) + 1;
      nodos.push(new Nodo(svg, agente.agentes, anillo));
    }
  });
}

circulos.forEach((circulo) => {
  const elemento = document.createElement('li');
  elemento.innerText = circulo.circulos;
  listaCirculos.appendChild(elemento);
});

function animar() {
  nodos.forEach((nodo) => {
    nodo.actualizar();
  });

  requestAnimationFrame(animar);
}

// console.log(agentes);

console.log('..:: Desarrollado por el Laboratorio EnFlujo - http://enflujo.com ::..');
