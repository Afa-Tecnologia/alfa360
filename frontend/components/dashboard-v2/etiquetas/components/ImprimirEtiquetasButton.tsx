'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import JsBarcode from 'jsbarcode';

interface ImprimirEtiquetasButtonProps {
  printRef: React.RefObject<HTMLDivElement>;
  etiquetaWidth: number;
  etiquetaHeight: number;
  offsetX: number;
  offsetY: number;
  colunas: number;
  disabled?: boolean;
}

export const ImprimirEtiquetasButton: React.FC<
  ImprimirEtiquetasButtonProps
> = ({
  printRef,
  etiquetaWidth,
  etiquetaHeight,
  offsetX,
  offsetY,
  colunas,
  disabled,
}) => {
  const handlePrint = () => {
    if (!printRef.current) return;

    const etiquetas = Array.from(printRef.current.querySelectorAll('.border'));
    const labelsHtml = etiquetas
      .map((el) => {
        const nome = el.querySelector('.etiqueta-nome')?.textContent || '';
        const info = el.querySelector('.etiqueta-info')?.textContent || '';
        const preco = el.querySelector('.etiqueta-preco')?.textContent || '';
        const barcodeValue =
          el.querySelector('svg')?.getAttribute('data-barcode-value') ||
          el.querySelector('svg text')?.textContent ||
          '';

        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        svg.setAttribute('height', '30');
        svg.setAttribute('width', '100');

        JsBarcode(svg, barcodeValue, {
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
              padding-top: ${offsetY}mm;
              padding-left: ${offsetX}mm;
              box-sizing: border-box;
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
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Button onClick={handlePrint} variant="default" disabled={disabled}>
        Imprimir etiquetas
      </Button>
    </div>
  );
};
