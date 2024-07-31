<?php

namespace Database\Factories;

use App\Models\BarangService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BarangService>
 */
class BarangServiceFactory extends Factory
{
    protected $model = BarangService::class;

    public function definition()
    {
        return [
            'KODE_SERVICE' => $this->faker->unique()->regexify('[A-Z0-9]{20}'),
            'KODE' => $this->faker->regexify('[A-Z0-9]{20}'),
            'NAMA' => $this->faker->words(3, true),
            'KETERANGAN' => $this->faker->sentence,
            'QTY' => $this->faker->randomFloat(2, 0, 100),
            'STATUSAMBIL' => $this->faker->randomElement(['Antrian', 'Diproses', 'Selesai']),
        ];
    }
}