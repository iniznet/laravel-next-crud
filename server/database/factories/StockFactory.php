<?php

namespace Database\Factories;

use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    protected $model = Stock::class;

    public function definition()
    {
        return [
            'GUDANG' => '01',
            'KODE' => $this->faker->unique()->numerify('##########'),
            'KODE_TOKO' => $this->faker->numerify('##########'),
            'NAMA' => $this->faker->sentence(3),
            'JENIS' => 'B',
            'GOLONGAN' => '01',
            'RAK' => '',
            'DOS' => '1',
            'SATUAN' => 'UNT',
            'SATUAN2' => '',
            'SATUAN3' => '',
            'SUPPLIER' => '',
            'ISI' => 0,
            'ISI2' => 0,
            'DISCOUNT' => 0.00,
            'PAJAK' => 0.00,
            'MIN' => 0.00,
            'MAX' => 0.00,
            'HB' => $this->faker->randomFloat(2, 1000000, 10000000),
            'HB2' => 0.00,
            'HB3' => 0.00,
            'HJ' => $this->faker->randomFloat(2, 1000000, 10000000),
            'HJ2' => 0.00,
            'HJ3' => 0.00,
            'EXPIRED' => $this->faker->date('Y-m-d', '1970-01-01'),
            'TGL_MASUK' => $this->faker->date('Y-m-d', '1970-01-01'),
            'FOTO' => '',
            'BERAT' => 0.00,
            'HJ_TINGKAT1' => 0.00,
            'HJ_TINGKAT2' => 0.00,
            'HJ_TINGKAT3' => 0.00,
            'HJ_TINGKAT4' => 0.00,
            'HJ_TINGKAT5' => 0.00,
            'HJ_TINGKAT6' => 0.00,
            'HJ_TINGKAT7' => 0.00,
            'MIN_TINGKAT1' => 0,
            'MIN_TINGKAT2' => 0,
            'MIN_TINGKAT3' => 0,
            'MIN_TINGKAT4' => 0,
            'MIN_TINGKAT5' => 0,
            'MIN_TINGKAT6' => 0,
            'MIN_TINGKAT7' => 0,
        ];
    }
}
