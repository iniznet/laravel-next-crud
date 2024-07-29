<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SparepartService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SparepartServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SparepartService::factory()->count(200)->create();
    }
}
