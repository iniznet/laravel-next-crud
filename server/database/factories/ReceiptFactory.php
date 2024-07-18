<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Receipt>
 */
class ReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'R' . time(),
            'customer_id' => User::where('role', 'customer')->pluck('id')->random(),
            'receiver_id' => User::where('role', 'admin')->pluck('id')->random(),
            'technician_id' => User::where('role', 'technician')->pluck('id')->random(),
        ];
    }
}
