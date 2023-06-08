import { leyendo } from '../cerebros/general';
import Nodo from '../componentes/Nodo';

const infoTitulo = document.getElementById('infoTitulo') as HTMLDivElement;
const infoImg = document.getElementById('infoImg') as HTMLDivElement;
const infoPerfil = document.getElementById('infoPerfil') as HTMLDivElement;
const infoRelaciones = document.getElementById('infoRelaciones') as HTMLUListElement;
const contenedorRelaciones = infoRelaciones.parentElement as HTMLDivElement;
const contenedorPerfil = infoPerfil.parentElement as HTMLDivElement;

leyendo.subscribe((estaLeyendo) => {
  if (!estaLeyendo) {
    contenedorPerfil.classList.add('casiVisible');
  } else {
    contenedorPerfil.classList.remove('casiVisible');
  }
});

export function crearParrafos(texto: string) {
  if (!texto) return;
  const partesDesc = texto.split('\n').filter((parte) => parte.length);

  return partesDesc.map((parte) => {
    const parrafo = document.createElement('p');
    parrafo.innerText = parte;
    return parrafo;
  });
}

export function llenarInfo(nodo: Nodo) {
  if (!nodo) return;
  let tieneRelaciones = false;
  let tienePerfil = false;

  if (nodo.nombre) {
    infoTitulo.innerText = nodo.nombre;
  }

  if (nodo.foto) {
    infoImg.replaceChildren(nodo.foto);
  } else {
    infoImg.replaceChildren();
  }

  if (nodo.relaciones) {
    infoRelaciones.replaceChildren(...nodo.relaciones);
    tieneRelaciones = true;
    contenedorRelaciones.classList.add('mostrar');
  } else {
    contenedorRelaciones.classList.remove('mostrar');
  }

  if (nodo.perfil) {
    infoPerfil.replaceChildren(...nodo.perfil);
    tienePerfil = true;
    contenedorPerfil.classList.add('mostrar');
  } else {
    contenedorPerfil.classList.remove('mostrar');
  }

  if (!tieneRelaciones && tienePerfil) {
    contenedorPerfil.classList.add('sinTitulo');
    contenedorPerfil.classList.add('mostrar');
    contenedorPerfil.classList.remove('cerrado');
  } else if (tieneRelaciones && !tienePerfil) {
    contenedorRelaciones.classList.add('sinTitulo');
    contenedorRelaciones.classList.add('mostrar');
    contenedorRelaciones.classList.remove('cerrado');
  } else {
    contenedorRelaciones.classList.remove('sinTitulo');
    contenedorPerfil.classList.remove('sinTitulo');
  }
}
