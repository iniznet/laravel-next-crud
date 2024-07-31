<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sparepartservice', function (Blueprint $table) {
            $table->char('KODE_SERVICE', 50)->nullable();
            $table->char('KODE_BARANG', 50)->nullable();
            $table->string('KODE', 50)->nullable();
            $table->decimal('HARGA', 16, 2)->default(0.00);
            $table->char('STATUS', 1)->default('J');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sparepartservice');
    }
};
