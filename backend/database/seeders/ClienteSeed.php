<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Cliente;
use App\Models\Clientes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClienteSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cliente::factory()->create([
            "name"=> "João",
            "last_name"=> "Carneiro",
            "email"=> "joao.silva@example.com",
            "phone"=> "(21) 98765-4321",
            "cpf"=> "123.456.789-00",
            "adress"=> "Rua das Flores, 123",
            "city"=> "Rio de Janeiro",
            "state"=> "RJ",
            "cep"=> "12345-678",
            "date_of_birth"=> "1990-05-15"
        ]);
    }
}
