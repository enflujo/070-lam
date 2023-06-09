import { leyendo } from '../cerebros/general';
import { DatosAgente, Relacion } from '../tipos';
import { crearParrafos } from '../utilidades/ayudas';
import Nodo from './Nodo';

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

export function crearInfo(datos: DatosAgente) {
  const { nombre, descripcion, img, relaciones, relacionesInvertidas } = datos;
  const respuesta: { foto?: HTMLImageElement; perfil?: HTMLParagraphElement[]; relaciones?: HTMLLIElement[] } = {};
  if (img) {
    const foto = new Image();
    foto.src = `${import.meta.env.BASE_URL}/imgs/${img}`;
    foto.setAttribute('alt', `Foto de ${nombre}`);
    respuesta.foto = foto;
  }

  if (descripcion) {
    respuesta.perfil = crearParrafos(descripcion);
  }

  if (relaciones.length) {
    respuesta.relaciones = relaciones.map((relacion) => {
      return elementoListaRelacion(relacion);
    });
  }

  if (relacionesInvertidas.length) {
    const relacionesActuales = respuesta.relaciones ? respuesta.relaciones : [];

    respuesta.relaciones = [
      ...relacionesActuales,
      ...relacionesInvertidas.map((relacion) => {
        return elementoListaRelacion(relacion);
      }),
    ];
  }

  return respuesta;
}

function elementoListaRelacion(relacion: Relacion) {
  const elemento = document.createElement('li');
  const descriptor = document.createElement('span');
  const relacionCon = document.createElement('span');

  elemento.className = 'relacion';
  descriptor.className = 'descriptor';
  relacionCon.className = 'relacionCon';

  descriptor.innerText = relacion.descriptor;
  if (relacion.con) relacionCon.innerText = relacion.con;

  if (relacion.activo) {
    elemento.classList.add('activo');
  }

  if (relacion.tipo) elemento.classList.add(relacion.tipo);

  elemento.appendChild(descriptor);
  elemento.appendChild(relacionCon);
  return elemento;
}
