import { FuenteDatos } from '../programa';
import { ListaImagenes } from '../tipos';
import { agregar, cargar } from '../utilidades/cargador';

let imagenes: ListaImagenes;

export async function cargarImagenes(datos: FuenteDatos) {
  datos.forEach((agente) => {
    if (agente.img) {
      agregar(agente.img);
    }
  });

  imagenes = await cargar();
}

export function buscarImagen(nombre: string) {
  return imagenes[nombre];
}
