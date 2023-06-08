import { FuenteDatos } from '../programa';
import { normalizarTexto } from '../utilidades/ayudas';
import { filtrarNodo } from './red';

const filtroPersonas = document.getElementById('filtroPersonas') as HTMLSelectElement;
const filtroOrgs = document.getElementById('filtroOrgs') as HTMLSelectElement;

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
}
