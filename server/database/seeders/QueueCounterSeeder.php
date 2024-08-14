<?php

namespace Database\Seeders;

use App\Models\QueueCounter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QueueCounterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        QueueCounter::updateOrCreate(
            ['id' => 1],
            ['name' => 'Servis', 'current_number' => 1]
        );

        QueueCounter::updateOrCreate(
            ['id' => 2],
            ['name' => 'Beli', 'current_number' => 1]
        );

        QueueCounter::updateOrCreate(
            ['id' => 3],
            ['name' => 'Pembayaran', 'current_number' => 1]
        );

        QueueCounter::updateOrCreate(
            ['id' => 4],
            ['name' => 'Konsultasi', 'current_number' => 1]
        );
    }
}
