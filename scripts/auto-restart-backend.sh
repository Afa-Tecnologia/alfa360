#!/bin/bash

# Verificar uso de CPU do backend
CPU_USAGE=$(docker stats alfa360-backend --no-stream --format "table {{.CPUPerc}}" | tail -1 | sed 's/%//')

# Se CPU > 150%, restart do backend
if (( $(echo "$CPU_USAGE > 150" | bc -l) )); then
    echo "🚨 CPU do backend muito alto: ${CPU_USAGE}% - Reiniciando..."
    docker compose restart backend
    echo "✅ Backend reiniciado em $(date)"
    
    # Log do evento
    echo "$(date): Backend reiniciado - CPU estava em ${CPU_USAGE}%" >> /var/log/alfa360-auto-restart.log
fi 