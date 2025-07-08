<?php
namespace App\Services\Barcode;

use App\Models\Produto;

    /**
     * Serviço responsável por gerar códigos de barras EAN-13 válidos e únicos.
     * 
     * Lógica baseada no padrão GS1 para o Brasil (prefixo 789).
     * 
     * Estrutura do código: 789 + categoria (2 dígitos) + número aleatório (7 dígitos) + dígito verificador (1 dígito).
 */
class BarcodeService
{
    /**
     * Prefixo GS1 Brasil (789).
     * @var string
     */
    const PREFIX = '789';

    /**
     * Gera um código EAN-13 válido e único (verificando se já existe no banco).
     *
     * @param int $categoryId ID da categoria do produto (usado para formar parte do código)
     * @param int $maxAttempts Número máximo de tentativas para gerar um código único
     * @return string Código EAN-13 válido e único
     */
    public static function generateVerifiedEAN13(int $categoryId, int $maxAttempts = 5): string
    {
        $attempts = 0;
        $barcode = '';
        $safeCategory = is_numeric($categoryId) ? (int) $categoryId : 0;

        do {
            $barcode = self::generateEAN13($safeCategory);
            $attempts++;
        } while (
            Produto::where('code', $barcode)->exists() &&
            $attempts < $maxAttempts
        );

        return $barcode;
    }

    /**
     * Gera um código EAN-13 válido com base na categoria.
     *
     * @param int $categoryId ID da categoria do produto
     * @return string Código EAN-13 válido (13 dígitos)
     */
    public static function generateEAN13(int $categoryId): string
    {
        $prefix = self::PREFIX;

        // Garante que a categoria terá 2 dígitos
        $categoryDigits = str_pad($categoryId, 2, '0', STR_PAD_LEFT);

        // Gera 7 dígitos aleatórios
        $randomDigits = str_pad(strval(mt_rand(0, 9999999)), 7, '0', STR_PAD_LEFT);

        // Monta os 12 primeiros dígitos
        $partial = substr("{$prefix}{$categoryDigits}{$randomDigits}", 0, 12);

        // Calcula o dígito verificador
        $checkDigit = self::calculateCheckDigit($partial);

        return $partial . $checkDigit;
    }

    /**
     * Calcula o dígito verificador EAN-13 com base nos 12 primeiros dígitos.
     *
     * @param string $code Código de 12 dígitos
     * @return int Dígito verificador (0 a 9)
     * @throws \Exception Se o código não tiver exatamente 12 dígitos
     */
    public static function calculateCheckDigit(string $code): int
    {
        if (strlen($code) !== 12) {
            throw new \Exception("Código base deve ter 12 dígitos.");
        }

        $sum = 0;
        for ($i = 0; $i < 12; $i++) {
            $digit = (int) $code[$i];
            $sum += ($i % 2 === 0) ? $digit : $digit * 3;
        }

        $remainder = $sum % 10;
        return ($remainder === 0) ? 0 : 10 - $remainder;
    }

    /**
     * Verifica se um código EAN-13 é válido com base no cálculo do dígito verificador.
     *
     * @param string $code Código EAN-13 (13 dígitos)
     * @return bool True se for válido, False caso contrário
     */
    public static function isValidEAN13(string $code): bool
    {
        if (!preg_match('/^\d{13}$/', $code)) return false;

        $expected = substr($code, 0, 12);
        $checkDigit = self::calculateCheckDigit($expected);

        return $checkDigit === (int) substr($code, 12, 1);
    }
}