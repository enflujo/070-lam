import { agenteActivo, poderesActivos } from '../cerebros/general';
import { reiniciarAgentes } from './filtros';

export function reiniciarTodo() {
  poderesActivos.set([]);
  agenteActivo.set(null);
  reiniciarAgentes();
  // mostrarAgente.set(null);
  // leyendo.set(false);
  // prenderTodos();
  // reiniciarFiltros();
}
