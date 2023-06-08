import grados from '../datos/grados.json';
import { FuenteDatos } from '../programa';
import { crearParrafos, normalizarTexto } from '../utilidades/ayudas';
import { filtrarNodo, mostrarNodosEnAnillo, prenderTodos } from './red';

const filtroPersonas = document.getElementById('filtroPersonas') as HTMLSelectElement;
const filtroOrgs = document.getElementById('filtroOrgs') as HTMLSelectElement;
const cercanias = document.querySelector('#cercania .contenedor') as HTMLDivElement;

export function definirFiltros(datos: FuenteDatos) {
  if (!filtroPersonas || !filtroOrgs) return;
  const personas = datos.filter((fila) => fila.tipo === 'persona');
  const orgs = datos.filter((fila) => fila.tipo === 'org');

  personas.forEach((persona) => {
    filtroPersonas?.appendChild(new Option(persona.nombre, normalizarTexto(persona.nombre)));
  });

  orgs.forEach((org) => {
    filtroOrgs?.appendChild(new Option(org.nombre, normalizarTexto(org.nombre)));
  });

  filtroPersonas.onchange = () => {
    filtrarNodo(filtroPersonas.value);
  };

  filtroOrgs.onchange = () => {
    filtrarNodo(filtroOrgs.value);
  };

  const contenedores: HTMLElement[] = [];

  grados.forEach((grado) => {
    const contenedor = document.createElement('section');
    const titulo = document.createElement('h4');
    const botonColapsable = document.createElement('span');
    const contenido = document.createElement('div');

    contenedor.className = `infoSeccion subSeccion mostrar cerrado grado${grado.grado}`;
    titulo.className = 'tituloColapsable interTitulo';
    botonColapsable.className = 'colapsableBtn';
    contenido.className = 'colapsable';

    titulo.innerText = grado.nombre;
    titulo.appendChild(botonColapsable);

    const parrafos = crearParrafos(grado.descripcion);

    if (parrafos) {
      contenido.replaceChildren(...parrafos);
    }

    titulo.addEventListener('click', () => {
      contenedores.forEach((elemento) => {
        if (elemento !== contenedor) {
          elemento.classList.add('cerrado');
        }
      });
    });

    contenedor.onmouseenter = () => {
      mostrarNodosEnAnillo(grado.grado + 1);
    };

    contenedor.onmouseleave = () => {
      prenderTodos();
    };

    contenedor.appendChild(titulo);
    contenedor.appendChild(contenido);
    cercanias.appendChild(contenedor);

    contenedores.push(contenedor);
  });
}
