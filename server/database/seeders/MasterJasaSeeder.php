<?php

namespace Database\Seeders;

use App\Models\MasterJasa;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MasterJasaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MasterJasa::factory()->count(20)->create();
    }
}
