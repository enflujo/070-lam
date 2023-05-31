import { atom } from 'nanostores';
import { DatosAgente } from '../tipos';

export const leyendo = atom<boolean>(false);
export const mostrarAgente = atom<DatosAgente | null>(null);
export const estanOrbitando = atom<boolean>(true);
export const tipoAgente = atom<'persona' | 'org' | 'lam'>('lam');
export const agenteActivo = atom<string | null>(null);
