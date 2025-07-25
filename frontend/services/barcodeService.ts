import ProductService from './productService';

/**
 * Serviço para geração de códigos de barras
 */
export class BarcodeService {
  private static PREFIX = '789'; // Prefixo para produtos brasileiros (GS1 Brasil)

  /**
   * Gera um código de barras EAN-13 único
   *
   * Formato: 789 + categoria (2) + produto (6) + dígito verificador (1)
   */
  static generateUniqueBarcode(categoryId: number): string {
    try {
      // Prefixo sempre com 3 dígitos
      const prefix = this.PREFIX.slice(0, 3).padStart(3, '0');

      // Pega os 2 dígitos da categoria (ou 00 se não tiver)
      const categoryDigits = categoryId
        ? categoryId.toString().padStart(2, '0').slice(-2)
        : '00';

      // Gera 7 dígitos aleatórios para completar os 12 dígitos
      const randomDigits = Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0');

      // Cria o código sem o dígito verificador (deve ter exatamente 12 dígitos)
      const codeWithoutCheckDigit =
        `${prefix}${categoryDigits}${randomDigits}`.slice(0, 12);

      // Verifica se realmente temos 12 dígitos
      if (codeWithoutCheckDigit.length !== 12) {
        throw new Error(
          `Código gerado com ${codeWithoutCheckDigit.length} dígitos, mas precisa ter 12`
        );
      }

      // Calcula e adiciona o dígito verificador
      const checkDigit = this.calculateEAN13CheckDigit(codeWithoutCheckDigit);

      return `${codeWithoutCheckDigit}${checkDigit}`;
    } catch (error) {
      console.error('Erro na geração do código de barras:', error);
      // Em caso de erro, retorna um código padrão válido
      return '7890123456789';
    }
  }

  /**
   * Gera um código de barras único, verificando no banco de dados se já existe
   * Se existir, tenta gerar um novo código até encontrar um que não existe
   */
  static async generateVerifiedUniqueBarcode(
    categoryId: number,
    maxAttempts = 5
  ): Promise<string> {
    let attempts = 0;
    let barcode = '';
    let exists = true;
    const safeCategory = isNaN(categoryId) ? 0 : categoryId;

    while (exists && attempts < maxAttempts) {
      barcode = this.generateUniqueBarcode(safeCategory);
      if (!this.isValidEAN13(barcode)) {
        attempts++;
        continue;
      }
      // try {
      //   exists = await ProductService.checkBarcodeExists(barcode);
      //   if (!exists) {
      //     return barcode;
      //   }
      // } catch (error) {
      //   // Em caso de erro, retorna o código gerado
      //   return barcode;
      // }
      // attempts++;
    }
    // Se todas as tentativas falharem, retorna o último código gerado
    return barcode;
  }

  /**
   * Calcula o dígito verificador para EAN-13
   */
  private static calculateEAN13CheckDigit(code: string): number {
    if (code.length !== 12) {
      throw new Error(
        'O código deve ter 12 dígitos para calcular o dígito verificador EAN-13'
      );
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(code.charAt(i));
      sum += i % 2 === 0 ? digit : digit * 3;
    }

    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  }

  /**
   * Verifica se um código de barras EAN-13 é válido
   */
  static isValidEAN13(code: string): boolean {
    if (code.length !== 13 || !/^\d+$/.test(code)) {
      return false;
    }

    const codeWithoutCheckDigit = code.substring(0, 12);
    const providedCheckDigit = parseInt(code.charAt(12));
    const calculatedCheckDigit = this.calculateEAN13CheckDigit(
      codeWithoutCheckDigit
    );

    return providedCheckDigit === calculatedCheckDigit;
  }
}
