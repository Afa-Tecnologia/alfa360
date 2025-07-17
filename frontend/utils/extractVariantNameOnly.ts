export function extractVariantOnly(productName: string, variantName: string): string {
  if (variantName.toLowerCase().startsWith(productName.toLowerCase())) {
    return variantName.substring(productName.length).trim();
  }
  return variantName; // fallback: retorna tudo se não casar
}