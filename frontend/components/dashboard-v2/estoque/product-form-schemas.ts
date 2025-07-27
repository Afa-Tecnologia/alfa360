import { z } from 'zod';

// Schema para validação do produto
export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
  description: z
    .string()
    .min(3, { message: 'A descrição deve ter no mínimo 3 caracteres' }),
  purchase_price: z
    .string()
    .or(z.number())
    .or(z.null())
    .or(z.undefined())
    .transform((val) => {
      if (val === null || val === undefined || val === '') return '0';
      return val.toString();
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'O preço de compra deve ser um número positivo',
    }),
  selling_price: z
    .string()
    .or(z.number())
    .or(z.null())
    .or(z.undefined())
    .transform((val) => {
      if (val === null || val === undefined || val === '') return '0';
      return val.toString();
    })
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'O preço de venda deve ser um número positivo',
    }),
  quantity: z
    .string()
    .or(z.number())
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'A quantidade deve ser um número positivo',
    }),
  brand: z.string().min(1, { message: 'A marca é obrigatória' }),
  tipo_de_produto_id: z
    .union([z.string(), z.number()])
    .refine((val) => val !== '', {
      message: 'O tipo de produto é obrigatório',
    }),
  code: z.string().optional(),
  categoria_id: z.union([z.string(), z.number()]).refine((val) => val !== '', {
    message: 'A categoria é obrigatória',
  }),
});

// Schema para validação das variantes
export const variantSchema = z.object({
  id: z.any().optional(),
  name: z.string().default(''),
  quantity: z
    .string()
    .or(z.number())
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'O estoque deve ser um número positivo',
    }),
  images: z.array(z.string()).optional().default([]),
  atributos: z
    .array(
      z.object({
        atributo_id: z.union([z.string(), z.number()]),
        valor: z.string().min(1, 'O valor do atributo é obrigatório'),
      })
    )
    .min(1, 'Pelo menos um atributo é obrigatório')
    .default([]),
  type: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
