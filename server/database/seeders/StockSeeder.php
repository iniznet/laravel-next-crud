<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;

class StockSeeder extends Seeder
{
    public function run()
    {
        Stock::create([
            'GUDANG' => '01',
            'KODE' => '0000000001',
            'KODE_TOKO' => '0009999999',
            'NAMA' => 'Macbook Air 13 2020 (256GB) | Chip M1',
            'JENIS' => 'B',
            'GOLONGAN' => '01',
            'DOS' => '1',
            'SATUAN' => 'UNT',
            'HB' => 12199000.00,
            'HJ' => 12199000.00,
            'EXPIRED' => '1970-01-01',
            'TGL_MASUK' => '1970-01-01',
        ]);

        Stock::create([
            'GUDANG' => '01',
            'KODE' => '0000000002',
            'KODE_TOKO' => '0010000000',
            'NAMA' => 'Macbook Air 13 2022 (256GB) | Chip M2',
            'JENIS' => 'B',
            'GOLONGAN' => '01',
            'DOS' => '1',
            'SATUAN' => 'UNT',
            'HB' => 16499000.00,
            'HJ' => 16499000.00,
            'EXPIRED' => '1970-01-01',
            'TGL_MASUK' => '1970-01-01',
        ]);

        Stock::create([
            'GUDANG' => '01',
            'KODE' => '0000000003',
            'KODE_TOKO' => '0010000001',
            'NAMA' => 'Macbook Air 13 2022 (512GB) | Chip M2',
            'JENIS' => 'B',
            'GOLONGAN' => '01',
            'DOS' => '1',
            'SATUAN' => 'UNT',
            'HB' => 19999000.00,
            'HJ' => 19999000.00,
            'EXPIRED' => '1970-01-01',
            'TGL_MASUK' => '1970-01-01',
        ]);

        Stock::create([
            'GUDANG' => '01',
            'KODE' => '0000000004',
            'KODE_TOKO' => '0010000002',
            'NAMA' => 'Macbook Pro 13 2022 (512GB) | Chip M3',
            'JENIS' => 'B',
            'GOLONGAN' => '01',
            'DOS' => '1',
            'SATUAN' => 'UNT',
            'HB' => 26999000.00,
            'HJ' => 26999000.00,
            'EXPIRED' => '1970-01-01',
            'TGL_MASUK' => '1970-01-01',
        ]);

        Stock::factory()->count(100)->create();
    }
}
