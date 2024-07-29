<?php

namespace Database\Factories;

use App\Models\MasterJasa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MasterJasa>
 */
class MasterJasaFactory extends Factory
{
    protected $model = MasterJasa::class;

    public function definition()
    {
        return [
            'KODE' => $this->faker->unique()->regexify('[A-Z0-9]{3}'),
            'KETERANGAN' => $this->faker->sentence,
            'ESTIMASIHARGA' => $this->faker->randomFloat(2, 10000, 1000000),
        ];
    }
}