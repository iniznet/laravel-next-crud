<?php

namespace Database\Factories;

use App\Models\NotaService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NotaService>
 */
class NotaServiceFactory extends Factory
{
    protected $model = NotaService::class;

    public function definition()
    {
        return [
            'STATUS' => $this->faker->numberBetween(0, 1),
            'FAKTUR' => $this->faker->unique()->regexify('PSV[0-9]{17}'),
            'KODE' => $this->faker->regexify('SV[0-9]{18}'),
            'TGL' => $this->faker->date(),
            'TGLBAYAR' => $this->faker->date(),
            'PEMILIK' => $this->faker->name,
            'NOTELEPON' => $this->faker->phoneNumber,
            'ESTIMASISELESAI' => $this->faker->date(),
            'ESTIMASIHARGA' => $this->faker->randomFloat(2, 10000, 1000000),
            'HARGA' => $this->faker->randomFloat(2, 10000, 1000000),
            'NOMINALBAYAR' => $this->faker->randomFloat(2, 10000, 1000000),
            'DP' => $this->faker->randomFloat(2, 0, 500000),
            'PENERIMA' => $this->faker->name,
            'DATETIME' => $this->faker->dateTime(),
            'USERNAME' => $this->faker->userName,
        ];
    }
}