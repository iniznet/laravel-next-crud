<?php

namespace Database\Seeders;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Receipt::factory()
            ->count(10)
            ->create();

        ReceiptItem::factory()
            ->count(30)
            ->create();
    }
}
