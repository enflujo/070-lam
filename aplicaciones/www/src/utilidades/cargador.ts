import { ListaImagenes } from '../tipos';

const cargador = document.getElementById('cargador');
const proceso: HTMLSpanElement | null | undefined = cargador?.querySelector('.proceso');
const contenedorMensaje: HTMLSpanElement | null | undefined = cargador?.querySelector('.mensaje');
const baseURL = import.meta.env.BASE_URL;

const cola: string[] = [];
const tiempoEspera = 250;
let total = 0;
let cargado = 0;
let imgsCargadas = 0;

export function agregar(nombreArchivo: string) {
  cola.push(nombreArchivo);
}

export async function cargar(): Promise<ListaImagenes> {
  const imgs: ListaImagenes = {};

  return new Promise((resolver) => {
    setTimeout(() => {
      if (imgsCargadas !== cola.length) {
        mostrar();
      }
    }, tiempoEspera);

    for (const nombre of cola) {
      let totalSumado = false;
      let valorAnterior = 0;
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `${baseURL}/imgs/${nombre}`, true);
      xhr.responseType = 'blob';

      xhr.onload = () => {
        const img = new Image();
        img.src = URL.createObjectURL(xhr.response);
        imgsCargadas++;
        imgs[nombre] = img;

        if (imgsCargadas === cola.length) {
          esconder();
          resolver(imgs);
        }
      };

      xhr.onprogress = (evento) => {
        if (evento.lengthComputable) {
          if (!totalSumado) {
            total += evento.total;
            totalSumado = true;
          }

          cargado += evento.loaded - valorAnterior;
          valorAnterior = evento.loaded;

          if (!proceso || !contenedorMensaje) return;
          const porcentaje = Math.floor((cargado / total) * 100);

          proceso.style.width = `${porcentaje}%`;
          contenedorMensaje.innerText = `${porcentaje}% (${imgsCargadas} / ${cola.length})`;
        }
      };
      xhr.send();
    }
  });
}

function mostrar() {
  cargador?.classList.add('activo');
}

function esconder() {
  cargador?.classList.remove('activo');
}
