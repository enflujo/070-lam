import { auth, sheets } from '@googleapis/sheets';
import type { sheets_v4 } from '@googleapis/sheets';
import { writeFileSync } from 'fs';

type Dato = string | boolean | number;

const guardarJSON = (json: any, nombre: string) => {
  writeFileSync(`../www/src/datos/${nombre}.json`, JSON.stringify(json));
};

const tablas = ['datos-estructurados', 'agentes', 'organizaciones', 'personas', 'metadatos'];

function limpiarTabla(datosTabla: sheets_v4.Schema$Sheet) {
  const variables: string[] = [];
  const datos: { [llave: string]: Dato }[] = [];

  if (datosTabla.data) {
    if (datosTabla.data[0].rowData) {
      datosTabla.data[0].rowData.forEach((fila, i) => {
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
              }
            }
          });

          if (Object.keys(dato).length !== 0) {
            datos.push(dato);
          }
        }
      });
    }
  }

  return datos;
}

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

    const tablaAgentes = res.data.sheets?.find((obj) => obj.properties?.title === 'agentes');
    const tablaPersonas = res.data.sheets?.find((obj) => obj.properties?.title === 'personas');
    const tablaOrg = res.data.sheets?.find((obj) => obj.properties?.title === 'organizaciones');
    const tablaDatos = res.data.sheets?.find((obj) => obj.properties?.title === 'datos-estructurados');

    if (!tablaDatos) return;
    const datos = limpiarTabla(tablaDatos).filter((fila) => {
      if (fila.se_muestra) {
        delete fila.se_muestra;
        return true;
      }

      return false;
    });

    if (!tablaAgentes || !tablaPersonas || !tablaOrg) return;

    const personas = limpiarTabla(tablaPersonas);
    const orgs = limpiarTabla(tablaOrg);
    const agentes = limpiarTabla(tablaAgentes).filter((agente) => agente.se_muestra);

    const grados: { nombre: string; descripcion: string; grado: number }[] = [];

    const datosAgentes = agentes.map((agente) => {
      const persona = personas.find((persona) => persona.nombre === agente.nombre);

      delete agente.se_muestra;

      if (agente.nombre_grado) {
        grados.push({
          grado: +agente.grado,
          nombre: `${agente.nombre_grado}`,
          descripcion: `${agente.descripcion_grado}`,
        });
      }

      delete agente.nombre_grado;
      delete agente.descripcion_grado;

      // asignar relaciones
      const relaciones = datos
        .filter((fila) => fila.rrb === agente.nombre)
        .map((relacion) => {
          return {
            tipo: relacion.tipo_de_relacion,
            descriptor: relacion.descriptor_de_relacion,
            con: relacion.agente_2,
            activo: relacion.activo,
          };
        });

      if (persona) {
        return { ...agente, ...{ tipo: 'persona', descripcion: persona.descripcion, relaciones } };
      } else {
        const org = orgs.find((organizacion) => organizacion.nombre === agente.nombre);

        if (org) {
          return { ...agente, ...{ tipo: 'org', descripcion: org.descripcion, relaciones } };
        } else {
          return { ...agente, ...{ tipo: 'indefinido', relaciones } };
        }
      }
    });

    guardarJSON(datosAgentes, 'agentes');
  } catch (error) {
    console.error(error);
  }
}

iniciarSheets().catch(console.error);
