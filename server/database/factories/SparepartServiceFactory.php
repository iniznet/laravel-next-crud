<?php

namespace Database\Factories;

use App\Models\SparepartService;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SparepartService>
 */
class SparepartServiceFactory extends Factory
{
    protected $model = SparepartService::class;

    public function definition()
    {
        return [
            'KODE_SERVICE' => $this->faker->regexify('SV[0-9]{18}'),
            'KODE_BARANG' => $this->faker->regexify('[A-Z0-9]{5}'),
            'KODE' => $this->faker->regexify('[A-Z0-9]{3}'),
            'HARGA' => $this->faker->randomFloat(2, 1000, 100000),
            'STATUS' => $this->faker->randomElement(['J', 'B']),
        ];
    }
}