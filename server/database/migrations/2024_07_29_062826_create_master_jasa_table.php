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
        Schema::create('master_jasa', function (Blueprint $table) {
            $table->string('KODE', 50)->primary();
            $table->string('KETERANGAN', 255)->nullable();
            $table->decimal('ESTIMASIHARGA', 16, 2)->default(0.00);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_jasa');
    }
};
