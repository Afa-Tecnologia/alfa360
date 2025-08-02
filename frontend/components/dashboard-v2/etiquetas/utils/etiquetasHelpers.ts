import { EtiquetaVariante } from '../types/etiqueta.types';

export function filtrarVariantesComEstoque(
  variantes: EtiquetaVariante[]
): EtiquetaVariante[] {
  return variantes.filter((v) => v.quantity > 0);
}

export function formatarAtributos(variante: EtiquetaVariante): string {
  return variante.atributos
    .map((a) => `${a.name}: ${a.pivot.valor}`)
    .join(' | ');
}
