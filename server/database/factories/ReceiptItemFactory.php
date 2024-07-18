<?php

namespace Database\Factories;

use App\Enums\ReceiptStatus;
use App\Models\Receipt;
use App\Models\Service;
use App\Models\SparePart;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReceiptItem>
 */
class ReceiptItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'receipt_id' => Receipt::pluck('id')->random(),
            'item_type' => $this->faker->randomElement([Service::class, SparePart::class]),
            'item_id' => $this->faker->randomElement([Service::pluck('id')->random(), SparePart::pluck('id')->random()]),
            'description' => $this->faker->paragraph(),
            'status' => ReceiptStatus::QUEUED->value,
        ];
    }
}
