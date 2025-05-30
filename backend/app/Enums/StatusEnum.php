<?php

namespace App\Enums;

class StatusEnum
{
    // Status de Pagamento
    const PAYMENT_PENDING = 'PENDING';
    const PAYMENT_AUTHORIZED = 'AUTHORIZED';
    const PAYMENT_CAPTURED = 'CAPTURED';
    const PAYMENT_CANCELLED = 'CANCELLED';
    const PAYMENT_REFUNDED = 'REFUNDED';

    // Status de Caixa
    const CAIXA_OPEN = 'aberto';
    const CAIXA_CLOSED = 'fechado';
    const CAIXA_CANCELLED = 'cancelado';

    // Status de Movimentação
    const MOVIMENTACAO_PENDING = 'pending';
    const MOVIMENTACAO_COMPLETED = 'completed';
    const MOVIMENTACAO_CANCELLED = 'cancelled';
    const MOVIMENTACAO_ESTORNADO = 'estornado';
} 