import { agenteActivo, leyendo, mostrarAgente } from '../cerebros/general';
import { reiniciarFiltros } from './filtros';
import { prenderTodos } from './red';

export function reiniciarTodo() {
  mostrarAgente.set(null);
  agenteActivo.set(null);
  leyendo.set(false);
  prenderTodos();
  reiniciarFiltros();
}
