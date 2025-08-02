'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface Variant {
  id: number;
  name: string;
  color: string;
  size: string;
  stock: number;
  quantity: number;
  images: string[];
}

interface Product {
  id?: number | string;
  name: string;
  code?: string;
  selling_price: number | string;
  variants: Variant[];
}

interface BarcodeLabelProps {
  product: Product;
}

export function BarcodeLabel({ product }: BarcodeLabelProps) {
  const barcodeRefs = useRef<(SVGSVGElement | null)[]>([]);

  useEffect(() => {
    product.variants.forEach((variant, index) => {
      const svg = barcodeRefs.current[index];
      if (svg) {
        const code = `${product.code || product.id}`;
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
  }, [product]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Permita pop-ups para imprimir.');
      return;
    }

    const labelContent = product.variants ? 
    product.variants.map((variant, index) => {
        const code = `${product.code || product.id}-${variant.id}`;
        const info = `${variant.name}`

        return `
          <div class="label">
            <div class="product-name"></div>
            ${info ? `<div class="product-info">
              ${truncate(product.name)} <br/>| ${info}</div>` : ''}
            <div class="barcode">
              ${barcodeRefs.current[index]?.outerHTML || ''}
            </div>
            <div class="product-price">${formatPrice(product.selling_price)}</div>
          </div>
        `;
      })
      .join('') : '';

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
              grid-template-columns: repeat(3, 32mm);
              grid-auto-rows: 25mm;
              gap: 0mm;
              width: 96mm;
            }

            .label {
              width: 32mm;
              height: 25mm;
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
                size: 96mm auto; /* largura da bobina, altura automática */
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
          <div class="page">
            ${labelContent}
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
    <div className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {product.variants.map((variant, index) => {
          const code = `${product.code || product.id}`;
          const info = [variant.color, variant.size]
            .filter(Boolean)
            .join(' | ');

          return (
            <div
              key={index}
              className="border border-gray-300 p-2 flex flex-col justify-between items-center"
              style={{
                width: '32mm',
                height: '25mm',
              }}
            >
              <div className="text-[7px] font-bold text-center">
                {truncate(product.name)}
              </div>
              {info && (
                <div className="text-[6px] text-gray-600 text-center">
                  {info}
                </div>
              )}
              <div className="flex-1 flex items-center justify-center w-full">
                <svg
                  ref={(el) => {
                    barcodeRefs.current[index] = el;
                  }}
                />
              </div>
              <div className="text-[8px] font-bold">
                {formatPrice(product.selling_price)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex mt-4">
        <Button
          onClick={handlePrint}
          size="sm"
          className="flex items-center gap-2"
        >
          <Printer size={16} />
          Imprimir
        </Button>
      </div>
    </div>
  );
}
