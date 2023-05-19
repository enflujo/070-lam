import './scss/estilos.scss';
import csv from './datos.csv';
import organizaciones from './organizaciones.csv';
import personas from './personas.csv';

let datos;
const nodos = {};

function procesarDatos() {
  const campos = Object.keys(csv[0]);

  datos = csv.map((instancia) => {
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

console.log(datos, organizaciones, personas);

console.log('..:: Desarrollado por el Laboratorio EnFlujo - http://enflujo.com ::..');
