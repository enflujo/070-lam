export function procesarDatos(fuente) {
  const campos = Object.keys(fuente[0]);

  datos = datosEstructurados.map((instancia) => {
    for (const campo of campos) {
      const dato = instancia[campo];

      if (dato) {
        instancia[campo] = dato.trim();

        if (dato === 'FALSE') {
          instancia[campo] = false;
        }

        if (dato === 'TRUE') {
          instancia[campo] = true;
        }
      }
    }

    return instancia;
  });
}
