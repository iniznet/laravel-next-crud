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
        Schema::create('barangservice', function (Blueprint $table) {
            $table->char('KODE_SERVICE', 20)->primary();
            $table->char('KODE', 20)->nullable();
            $table->string('NAMA', 50)->nullable();
            $table->string('KETERANGAN', 255)->nullable();
            $table->decimal('QTY', 16, 2)->default(0.00);
            $table->char('STATUSAMBIL', 50)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangservice');
    }
};
