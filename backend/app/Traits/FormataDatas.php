<?php

namespace App\Traits;

trait FormataDatas
{
    /**
     * Prepara uma data para serialização JSON.
     * Usando o formato ISO 8601 para compatibilidade universal com JavaScript.
     *
     * @param \DateTimeInterface $date
     * @return string
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s.000\Z');
    }
} 