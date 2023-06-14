import { atom } from 'nanostores';
import Nodo from '../modulos/Nodo';

export const leyendo = atom<boolean>(false);
export const mostrarAgente = atom<Nodo | null>(null);
export const agenteActivo = atom<string | null>(null);
export const poderesActivos = atom<string[]>([]);
