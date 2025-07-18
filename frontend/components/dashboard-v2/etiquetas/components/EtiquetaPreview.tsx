import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { EtiquetaProduto, EtiquetaVariante } from '../types/etiqueta.types';

interface EtiquetaPreviewProps {
  produtos: EtiquetaProduto[];
  variantes: EtiquetaVariante[];
  quantidades: Record<number, number>;
  etiquetaWidth: number; // mm
  etiquetaHeight: number; // mm
}

export const EtiquetaPreview: React.FC<EtiquetaPreviewProps> = ({
  produtos,
  variantes,
  quantidades,
  etiquetaWidth,
  etiquetaHeight,
}) => {
  // Helper para pegar produto de uma variante
  const getProduto = (variante: EtiquetaVariante) =>
    produtos.find((p) => p.variants.some((v) => v.id === variante.id));

  // Helper para pegar atributos formatados
  const getAtributos = (variante: EtiquetaVariante) =>
    variante.atributos.map((a) => `${a.name}: ${a.pivot.valor}`).join(' | ');

  // refs para os códigos de barras (um para cada etiqueta)
  const barcodeRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    barcodeRefs.current.forEach((svg, idx) => {
      if (svg) {
        // Descobrir a variante/produto correspondente ao idx
        let count = 0;
        let foundVariante: EtiquetaVariante | undefined;
        let foundProduto: EtiquetaProduto | undefined;
        for (const variante of variantes) {
          const produto = getProduto(variante);
          const qtd = quantidades[variante.id] ?? variante.quantity;
          for (let i = 0; i < qtd; i++) {
            if (count === idx) {
              foundVariante = variante;
              foundProduto = produto;
              break;
            }
            count++;
          }
          if (foundVariante) break;
        }
        const code = foundProduto?.code || foundProduto?.id?.toString() || '';
        JsBarcode(svg, code, {
          format: 'CODE128',
          width: 1.1,
          height: 30,
          displayValue: true,
          fontSize: 9,
          margin: 0,
          textMargin: 2,
          fontOptions: 'bold',
        });
      }
    });
  }, [variantes, produtos, quantidades]);

  // Helper para renderizar etiquetas
  const renderEtiquetas = () => {
    let globalIdx = 0;
    return variantes.flatMap((variante) => {
      const produto = getProduto(variante);
      const qtd = quantidades[variante.id] ?? variante.quantity;
      if (!produto || qtd <= 0) return [];
      return Array.from({ length: qtd }).map((_, idx) => {
        const info = getAtributos(variante);
        const thisIdx = globalIdx++;
        return (
          <div
            key={variante.id + '-' + idx}
            className="border rounded-md shadow-sm p-2 m-2 flex flex-col items-center bg-white print:break-inside-avoid"
            aria-label={`Etiqueta de ${produto.name} - ${info}`}
            style={{
              width: `${etiquetaWidth}mm`,
              height: `${etiquetaHeight}mm`,
              minWidth: 40,
              minHeight: 40,
            }}
          >
            <div className="etiqueta-nome font-bold text-center mb-1 text-[8px]">
              {truncate(produto.name)}
            </div>
            {info && (
              <div className="etiqueta-info text-gray-600 text-center mb-1 text-[7px]">
                {info}
              </div>
            )}
            <div className="flex-1 flex items-center justify-center w-full mb-1">
              <svg
                ref={(el) => {
                  barcodeRefs.current[thisIdx] = el;
                }}
              />
            </div>
            <div className="etiqueta-preco font-bold text-[9px]">
              {formatPrice(produto.selling_price)}
            </div>
          </div>
        );
      });
    });
  };

  const formatPrice = (price: string | number) => {
    const number = Number(price);
    if (isNaN(number)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(number);
  };

  const truncate = (name: string) =>
    name.length > 14 ? name.substring(0, 15) + '...' : name;

  return (
    <div className="flex flex-wrap gap-2 justify-start print:gap-0 print:flex-row w-full max-w-5xl">
      {renderEtiquetas()}
    </div>
  );
};
