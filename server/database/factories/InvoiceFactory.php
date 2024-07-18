<?php

namespace Database\Factories;

use App\Models\Receipt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'PSV' . time(),
            'receipt_id' => $this->faker->unique()->randomElement(Receipt::pluck('id')->toArray()),
            'user_id' => User::pluck('id')->random(),
            'dp' => $this->faker->randomFloat(2, 1000, 1000000000),
            'amount' => 0,
            'finished_at' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }
}
