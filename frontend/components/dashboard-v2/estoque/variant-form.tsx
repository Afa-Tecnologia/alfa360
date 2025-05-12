'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { VariantImageUploader } from './variant-image-uploader';
import { useEffect, useRef } from 'react';

// Definição do tipo de variante
export interface VariantFormValues {
  id?: number | string;
  name: string;
  color: string;
  size: string;
  stock: string | number;
  images: string[];
  type?: string;
}

interface VariantFormProps {
  variant: VariantFormValues;
  index: number;
  onUpdate: (
    index: number,
    field: keyof VariantFormValues,
    value: string
  ) => void;
  onRemove: (index: number) => void;
  onUpdateImages: (index: number, images: string[]) => void;
  productName: string; // Add product name prop
}

export function VariantForm({
  variant,
  index,
  onUpdate,
  onRemove,
  onUpdateImages,
  productName,
}: VariantFormProps) {
  // Use ref to track previous values and prevent unnecessary updates
  const prevColorRef = useRef(variant.color);
  const prevSizeRef = useRef(variant.size);
  const prevProductNameRef = useRef(productName);

  // Auto-generate variant name when color or size changes
  useEffect(() => {
    // Only update if color, size, or productName has actually changed
    if (
      variant.color &&
      variant.size &&
      (variant.color !== prevColorRef.current ||
        variant.size !== prevSizeRef.current ||
        productName !== prevProductNameRef.current)
    ) {
      const generatedName =
        `${productName} ${variant.color.toUpperCase()} ${variant.size.toUpperCase()}`.trim();

      // Only update if the generated name is different from current name
      if (generatedName !== variant.name) {
        onUpdate(index, 'name', generatedName);
      }

      // Update refs
      prevColorRef.current = variant.color;
      prevSizeRef.current = variant.size;
      prevProductNameRef.current = productName;
    }
  }, [variant.color, variant.size, productName, index, onUpdate, variant.name]);

  return (
    <div className="border rounded-md p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>

      <h4 className="font-medium mb-3">Variante {index + 1}</h4>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={variant.name}
              readOnly
              disabled
              className="bg-muted"
              placeholder="Nome gerado automaticamente"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gerado automaticamente a partir do nome do produto, cor e tamanho
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium">Cor</label>
            <Input
              value={variant.color}
              onChange={(e) =>
                onUpdate(index, 'color', e.target.value.toUpperCase())
              }
              placeholder="Cor"
              className="uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Tamanho</label>
            <Input
              value={variant.size}
              onChange={(e) =>
                onUpdate(index, 'size', e.target.value.toUpperCase())
              }
              placeholder="Tamanho"
              className="uppercase"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Estoque</label>
            <Input
              type="number"
              value={variant.stock}
              onChange={(e) => onUpdate(index, 'stock', e.target.value)}
              placeholder="Quantidade"
              min="0"
            />
          </div>
        </div>

        {/* Componente de upload de imagens */}
        <div>
          <label className="text-sm font-medium">Imagens</label>
          <VariantImageUploader
            initialImages={variant.images || []}
            onChange={(urls) => onUpdateImages(index, urls)}
          />
        </div>
      </div>
    </div>
  );
}
