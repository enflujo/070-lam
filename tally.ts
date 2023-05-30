import { auth, sheets } from '@googleapis/sheets';
import { writeFileSync } from 'fs';

type Dato = string | boolean | number;

const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`./src/datos/${nombre}.json`, JSON.stringify(json));
};

const tablas = ['prueba-datos-estructurados', 'agentes', 'organizaciones', 'personas'];

async function iniciarSheets() {
  const conexion = new auth.GoogleAuth({
    keyFile: `./secretos/${process.env.SECRETOS}`,
    scopes: ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive'],
  });

  const cliente = sheets({
    version: 'v4',
    auth: conexion,
  });

  try {
    const res = await cliente.spreadsheets.get({
      spreadsheetId: process.env.ID_ARCHIVO,
      includeGridData: true,
    });

    tablas.forEach((nombre) => {
      const respuesta = res.data.sheets?.find((obj) => obj.properties?.title === nombre);

      if (respuesta) {
        const propiedades = respuesta.properties;
        const numFilas = propiedades?.gridProperties?.rowCount;
        const variables: string[] = [];
        const datos: { [llave: string]: Dato }[] = [];

        if (numFilas && respuesta.data) {
          if (respuesta.data[0].rowData) {
            respuesta.data[0].rowData.forEach((fila, i) => {
              if (i === 0) {
                fila.values?.forEach((valores) => {
                  if (valores.formattedValue) {
                    variables.push(valores.formattedValue);
                  }
                });
              } else {
                const dato: { [llave: string]: Dato } = {};

                fila.values?.forEach((valor, j) => {
                  const variable = variables[j];

                  if (variable !== 'cedula' && variable !== '_nota_') {
                    if (valor.userEnteredValue) {
                      if (valor.userEnteredValue.hasOwnProperty('boolValue')) {
                        dato[variable] = !!valor.userEnteredValue.boolValue;
                      } else if (valor.userEnteredValue.hasOwnProperty('numberValue')) {
                        dato[variable] = valor.userEnteredValue.numberValue as number;
                      } else if (valor.userEnteredValue.stringValue) {
                        dato[variable] = valor.userEnteredValue.stringValue.trim();
                      }
                    } else {
                      // console.log(valor);
                      // dato[variables[j]] = valor.formattedValue?.trim() as string;
                    }
                  }
                });

                datos.push(dato);
              }
            });

            if (variables.includes('se_muestra')) {
              guardarJSON(
                datos.filter((fila) => {
                  if (fila.se_muestra && Object.keys(fila).length !== 0) {
                    delete fila.se_muestra;
                    return true;
                  }

                  return false;
                }),
                nombre
              );
            } else {
              guardarJSON(
                datos.filter((fila) => Object.keys(fila).length !== 0),
                nombre
              );
            }
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

iniciarSheets().catch(console.error);
