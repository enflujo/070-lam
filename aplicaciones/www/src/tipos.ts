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
  nombre: string;
  descripcion?: string;
};
