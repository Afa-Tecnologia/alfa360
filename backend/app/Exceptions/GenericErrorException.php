<?php 

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class GenericErrorException extends Exception
{
    protected string $errorCode;
    protected int $statusCode;

    public function __construct(string $errorCode, int $statusCode, string $errorMessage = '')
    {
        parent::__construct($errorMessage ?: $this->getErrorMessage($statusCode));
        $this->errorCode = $errorCode;
        $this->statusCode = $statusCode;
    }

    /**
     * Obtém a mensagem de erro padrão com base no status HTTP
     */
    private function getErrorMessage(int $statusCode): string
    {
        return match ($statusCode) {
            400 => 'Algum dado está inválido.',
            404 => 'Registro não encontrado.',
            401 => 'Não autenticado, é preciso token de acesso.',
            403 => 'Operação proibida, o usuário não tem direitos.',
            500 => 'Erro interno no servidor.',
            default => 'Erro desconhecido.',
        };
    }

    /**
     * Converte a exceção para um JSONResponse
     */
    public function render(): JsonResponse
    {
        return response()->json([
            'error' => [
                'code' => $this->errorCode,
                'message' => $this->getMessage(),
            ]
        ], $this->statusCode);
    }
}
