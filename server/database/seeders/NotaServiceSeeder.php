<?php

namespace Database\Seeders;

use App\Models\NotaService;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class NotaServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NotaService::factory()->count(100)->create();
    }
}
