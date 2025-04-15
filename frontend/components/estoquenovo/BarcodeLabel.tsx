'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface BarcodeLabelProps {
  productName: string;
  productCode: string;
  productPrice: number;
  productSize?: string;
  productColor?: string;
}

export function BarcodeLabel({
  productName,
  productCode,
  productPrice,
  productSize,
  productColor,
}: BarcodeLabelProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  // Formata o preço para moeda brasileira
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(productPrice);

  useEffect(() => {
    if (barcodeRef.current && productCode) {
      try {
        JsBarcode(barcodeRef.current, productCode, {
          format: 'CODE128',
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch (error) {
        console.error('Erro ao gerar código de barras:', error);
      }
    }
  }, [productCode]);

  const handlePrint = () => {
    const printContent = document.getElementById('barcode-label');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para imprimir a etiqueta.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta - ${productName}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .label-container {
              width: 300px;
              border: 1px solid #ddd;
              padding: 10px;
              margin: 10px auto;
              box-sizing: border-box;
            }
            .product-name {
              font-size: 14px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .product-info {
              font-size: 12px;
              margin-bottom: 5px;
            }
            .product-price {
              font-size: 16px;
              font-weight: bold;
              margin-top: 5px;
            }
            svg {
              max-width: 100%;
            }
            @media print {
              body {
                width: 100%;
                margin: 0;
                padding: 0;
              }
              .label-container {
                page-break-inside: avoid;
                border: none;
              }
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="label-container">
            ${printContent.innerHTML}
          </div>
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
    <div className="max-w-xs border rounded-md p-4">
      <div id="barcode-label">
        <div className="text-center mb-1 font-bold text-sm">{productName}</div>
        {(productSize || productColor) && (
          <div className="text-center mb-2 text-xs text-gray-600">
            {productColor && `Cor: ${productColor}`}
            {productSize && productColor && ' | '}
            {productSize && `Tam: ${productSize}`}
          </div>
        )}
        <div className="flex justify-center">
          <svg ref={barcodeRef}></svg>
        </div>
        <div className="text-center mt-2 font-bold">{formattedPrice}</div>
      </div>
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          Imprimir Etiqueta
        </Button>
      </div>
    </div>
  );
}
