<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()
            ->count(1)
            ->create([
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'role' => 'admin',
            ]);

        User::factory()
            ->count(50)
            ->create();
    }
}
