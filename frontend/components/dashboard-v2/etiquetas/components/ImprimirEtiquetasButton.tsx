import React from 'react';
import { Button } from '@/components/ui/button';
import JsBarcode from 'jsbarcode';
import { EtiquetaProduto, EtiquetaVariante } from '../types/etiqueta.types';

interface ImprimirEtiquetasButtonProps {
  printRef: React.RefObject<HTMLDivElement>;
  etiquetaWidth: number;
  etiquetaHeight: number;
  colunas: number;
  disabled?: boolean;
}

function formatPrice(price: string | number) {
  const number = Number(price);
  if (isNaN(number)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(number);
}

function truncate(name: string) {
  return name.length > 14 ? name.substring(0, 15) + '...' : name;
}

export const ImprimirEtiquetasButton: React.FC<
  ImprimirEtiquetasButtonProps
> = ({ printRef, etiquetaWidth, etiquetaHeight, colunas, disabled }) => {
  const handlePrint = () => {
    if (!printRef.current) return;
    // Recuperar os dados das etiquetas do DOM (do preview)
    const etiquetas = Array.from(printRef.current.querySelectorAll('.border'));
    const labelsHtml = etiquetas
      .map((el, idx) => {
        // Extrair dados do DOM
        const nome = el.querySelector('.etiqueta-nome')?.textContent || '';
        const info = el.querySelector('.etiqueta-info')?.textContent || '';
        const preco = el.querySelector('.etiqueta-preco')?.textContent || '';
        // Gerar SVG do código de barras
        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        svg.setAttribute('height', '30');
        svg.setAttribute('width', '100');
        const code = el.querySelector('svg')?.textContent || '';
        // Tentar pegar o código de barras do alt ou do produto
        const barcodeValue =
          el.querySelector('svg')?.getAttribute('data-barcode-value') || '';
        // Se não conseguir, pega do texto
        const barcodeText = el.querySelector('svg text')?.textContent || '';
        // Renderizar o código de barras usando JsBarcode
        const barcodeFinal = barcodeValue || barcodeText || '';
        JsBarcode(svg, barcodeFinal, {
          format: 'CODE128',
          width: 1.1,
          height: 30,
          displayValue: true,
          fontSize: 9,
          margin: 0,
          textMargin: 2,
          fontOptions: 'bold',
        });
        return `
        <div class="label">
          <div class="product-name">${nome}</div>
          <div class="product-info">${info}</div>
          <div class="barcode">${svg.outerHTML}</div>
          <div class="product-price">${preco}</div>
        </div>
      `;
      })
      .join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Permita pop-ups para imprimir.');
      return;
    }
    printWindow.document.write(`
      <html>
        <head>
          <title>Etiquetas</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, sans-serif;
            }
            .page {
              display: grid;
              grid-template-columns: repeat(${colunas}, ${etiquetaWidth}mm);
              grid-auto-rows: ${etiquetaHeight}mm;
              gap: 0mm;
              width: ${etiquetaWidth * colunas}mm;
            }
            .label {
              width: ${etiquetaWidth}mm;
              height: ${etiquetaHeight}mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              padding: 2mm;
              box-sizing: border-box;
              overflow: hidden;
            }
            .product-name,
            .product-info,
            .product-price {
              font-size: 8px;
              font-weight: bold;
              text-align: center;
              line-height: 1;
            }
            .barcode {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              max-height: 12mm;
            }
            .barcode svg {
              max-width: 100%;
              height: auto;
              max-height: 12mm;
            }
            @media print {
              @page {
                size: ${etiquetaWidth * colunas}mm auto;
                margin: 0;
              }
              body, html {
                margin: 0;
                padding: 0;
              }
              .label {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">${labelsHtml}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Button onClick={handlePrint} variant="default" disabled={disabled}>
      Imprimir etiquetas
    </Button>
  );
};
