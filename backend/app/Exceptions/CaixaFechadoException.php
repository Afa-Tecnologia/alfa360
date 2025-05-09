<?php
// app/Exceptions/CaixaFechadoException.php
namespace App\Exceptions;

use Exception;

class CaixaFechadoException extends Exception
{
    public function __construct($message = "Não é possível criar pedidos sem um caixa aberto", $code = 400)
    {
        parent::__construct($message, $code);
    }
}