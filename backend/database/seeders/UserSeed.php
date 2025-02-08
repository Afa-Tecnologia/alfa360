<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            "name" => "Renata Paz",
            "email" => "renatapaz@gmail.com",
            "password" => "12345678",
            "perfil" => "vendedor",
        ]);
    }
}
