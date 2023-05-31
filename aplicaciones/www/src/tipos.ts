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

export type DatosAgente = {
  circulo_1: string;
  circulo_2?: string;
  circulo_3?: string;
  nombre: string;
  descripcion?: string;
  grado: number;
  img: string;
  tipo: 'persona' | 'org' | 'lam';
  relaciones: Relacion[];
};

export type Relacion = {
  tipo: 'persona - organización' | 'persona - persona' | 'organización - organización';
  descriptor: string;
  con: string;
  activo: boolean;
};
