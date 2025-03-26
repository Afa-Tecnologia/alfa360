<?php

namespace App\Exceptions;

use Exception;

class EstoqueInsuficienteException extends Exception
{
    public function __construct($message = "Estoque insuficiente para completar a operação", $code = 422, \Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }

    public function render($request)
    {
        return response()->json([
            'error' => true,
            'message' => $this->getMessage(),
        ], (int)$this->getCode() ?: 422);
    }
} 