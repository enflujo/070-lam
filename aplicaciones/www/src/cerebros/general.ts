import { atom, map } from 'nanostores';
import Nodo from '../componentes/Nodo';

export const leyendo = atom<boolean>(false);
export const mostrarAgente = atom<Nodo | null>(null);
export const estanOrbitando = atom<boolean>(true);
export const tipoAgente = atom<'persona' | 'org' | 'lam'>('lam');
export const agenteActivo = atom<string | null>(null);
export const nodos = map<Nodo>();