<?php

namespace Database\Seeders;

use App\Models\BarangService;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class BarangServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BarangService::factory()->count(50)->create();
    }
}
