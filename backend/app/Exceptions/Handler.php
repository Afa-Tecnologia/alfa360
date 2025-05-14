<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

//     public function render($request, Throwable $exception)
// {
//     if ($exception instanceof \Illuminate\Validation\ValidationException) {
//         return response()->json([
//             'message' => 'Erro de validação',
//             'errors' => $exception->errors(),
//         ], 422);
//     }

//     return parent::render($request, $exception);
// }

public function render($request, Throwable $exception)
{
    if ($exception instanceof AuthenticationException) {
        return response()->json([
            'message' => 'Token inválido ou inexistente. Por favor, faça login novamente.',
        ], 401);
    }

    if ($request->expectsJson()) {
        if ($exception instanceof ValidationException) {
            return response()->json([
                'message' => 'Os dados fornecidos são inválidos.',
                'errors' => $exception->errors(),
            ], 422);
        }
        
        if ($exception instanceof \Exception) {
            return response()->json([
                'message' => 'Ocorreu um erro no servidor.',
            ], 500);
        }
    }

    return parent::render($request, $exception);
}

}
