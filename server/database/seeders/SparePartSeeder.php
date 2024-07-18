<?php

namespace Database\Seeders;

use App\Models\SparePart;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SparePartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        SparePart::factory()
            ->count(10)
            ->create();
    }
}
