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
        Schema::create('notaservice', function (Blueprint $table) {
            $table->id('ID');
            $table->tinyInteger('STATUS')->default(0);
            $table->string('FAKTUR', 50);
            $table->string('KODE', 20);
            $table->date('TGL')->default('1970-01-01');
            $table->date('TGLBAYAR')->default('1970-01-01');
            $table->string('PEMILIK', 50);
            $table->string('NOTELEPON', 50);
            $table->date('ESTIMASISELESAI')->default('1970-01-01');
            $table->decimal('ESTIMASIHARGA', 16, 2)->default(0.00);
            $table->decimal('HARGA', 16, 2)->default(0.00);
            $table->decimal('NOMINALBAYAR', 16, 2)->default(0.00);
            $table->decimal('DP', 16, 2)->default(0.00);
            $table->string('PENERIMA', 50);
            $table->dateTime('DATETIME')->default('1970-01-01 00:00:00');
            $table->string('USERNAME', 50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notaservice');
    }
};
