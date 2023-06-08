import { Punto } from '../tipos';

const circulos = document.querySelectorAll<SVGCircleElement>('circle');

export function escalarAnillos(centro: Punto, pasoRadio: number) {
  circulos?.forEach((circulo, i) => {
    circulo.setAttribute('cx', `${centro.x}`);
    circulo.setAttribute('cy', `${centro.y}`);
    circulo.setAttribute('r', `${(i + 1) * pasoRadio}`);
  });
}
