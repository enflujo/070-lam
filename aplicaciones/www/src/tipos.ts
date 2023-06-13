export type Dims = {
  ancho: number;
  alto: number;
  min: number;
  pasoR: number;
  centro: Punto;
};

export type Punto = {
  x: number;
  y: number;
};

export type TipoAgente = 'persona' | 'org' | 'lam';

export type DatosAgente = {
  nombre: string;
  nombre_corto: string;
  descripcion?: string;
  grado: number;
  img?: string;
  tipo: TipoAgente;
  relaciones: Relacion[];
  relacionesInvertidas: Relacion[];
};

export type TiposPoder = 'politica' | 'comercio' | 'iglesiacatolica' | 'policia' | 'medios' | 'lam' | 'educacion';

export type Relacion = {
  // tipoRelacion: 'perOrg' | 'perPer' | 'orgOrg';
  tipos: TiposPoder[];
  descriptor: string;
  con: string;
  activo: boolean;
};

export type NodoRelacion = { linea: SVGLineElement; tipo: string; hacia?: number; relacionNormal: boolean };

export type ListaImagenes = { [llave: string]: HTMLImageElement };
