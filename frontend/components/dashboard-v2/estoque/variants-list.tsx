'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { VariantForm, VariantFormValues } from './variant-form';

interface VariantsListProps {
  variants: VariantFormValues[];
  productName: string;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: (
    index: number,
    field: keyof VariantFormValues,
    value: string
  ) => void;
  onUpdateVariantImages: (index: number, images: string[]) => void;
}

export function VariantsList({
  variants,
  productName,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onUpdateVariantImages,
}: VariantsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Variantes do Produto</h3>
        <Button type="button" size="sm" onClick={onAddVariant}>
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Nenhuma variante cadastrada
          </p>
          <Button
            type="button"
            variant="link"
            onClick={onAddVariant}
            className="mt-2"
          >
            Adicionar Variante
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <VariantForm
              key={variant.id || index}
              variant={variant}
              index={index}
              onUpdate={onUpdateVariant}
              onRemove={onRemoveVariant}
              onUpdateImages={onUpdateVariantImages}
              productName={productName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
