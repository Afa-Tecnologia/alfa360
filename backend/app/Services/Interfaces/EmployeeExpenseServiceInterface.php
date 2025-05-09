<?php

namespace App\Services\Interfaces;

use App\DTO\EmployeeExpenseDTO;

interface EmployeeExpenseServiceInterface
{
    /**
     * Obter todas as despesas aplicando filtros
     */
    public function getAllExpenses(EmployeeExpenseDTO $filters);
    
    /**
     * Obter despesas por funcionário
     */
    public function getExpensesByEmployee($employeeId, EmployeeExpenseDTO $filters);
    
    /**
     * Obter resumo das despesas
     */
    public function getExpensesSummary(EmployeeExpenseDTO $filters);
    
    /**
     * Criar uma nova despesa
     */
    public function createExpense(array $data);
    
    /**
     * Atualizar uma despesa existente
     */
    public function updateExpense($id, array $data);
    
    /**
     * Excluir uma despesa
     */
    public function deleteExpense($id);
} 