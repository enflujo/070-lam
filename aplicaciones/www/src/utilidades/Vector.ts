export default class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  definir(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  sumar(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sumarEscala(escala: number) {
    this.x += escala;
    this.y += escala;
    return this;
  }

  restar(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  subScalar(escala: number) {
    this.x -= escala;
    this.y -= escala;
    return this;
  }

  restarVectores(a: Vector, b: Vector) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }

  multiplicar(v: Vector) {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  multiplicarEscala(escala: number) {
    if (isFinite(escala)) {
      this.x *= escala;
      this.y *= escala;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  multiplicarVectores(a: Vector, b: Vector) {
    this.x = a.x * b.x;
    this.y = a.y * b.y;
    return this;
  }

  dividir(v: Vector) {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  divideScalar(escala: number) {
    return this.multiplicarEscala(1 / escala);
  }

  largoAlCuadrado() {
    return this.x * this.x + this.y * this.y;
  }

  largo() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  definirLargo(length: number) {
    return this.multiplicarEscala(length / this.largo());
  }

  distanciaA(v: Vector) {
    return Math.sqrt(this.distanciaAlCuadrado(v));
  }

  normalizar() {
    return this.divideScalar(this.largo());
  }

  distanciaAlCuadrado(v: Vector) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  copy(v: Vector) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
}
