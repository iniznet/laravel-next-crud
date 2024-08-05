<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStockTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('stock', function (Blueprint $table) {
            $table->id('ID');
            $table->char('GUDANG', 4)->default('');
            $table->string('KODE', 20)->default('');
            $table->string('KODE_TOKO')->nullable();
            $table->string('NAMA')->default('');
            $table->char('JENIS', 1)->default('B');
            $table->char('GOLONGAN', 4)->default('');
            $table->char('RAK', 4)->nullable();
            $table->char('DOS', 1)->default('1');
            $table->char('SATUAN', 4)->nullable();
            $table->char('SATUAN2', 4)->nullable();
            $table->char('SATUAN3', 4)->nullable();
            $table->char('SUPPLIER', 6)->nullable();
            $table->double('ISI', 16, 0)->default(0);
            $table->double('ISI2', 16, 0)->default(0);
            $table->double('DISCOUNT', 16, 2)->default(0.00);
            $table->double('PAJAK', 16, 2)->default(0.00);
            $table->double('MIN', 16, 2)->default(0.00);
            $table->double('MAX', 16, 2)->default(0.00);
            $table->double('HB', 16, 2)->default(0.00);
            $table->double('HB2', 16, 2)->default(0.00);
            $table->double('HB3', 16, 2)->default(0.00);
            $table->double('HJ', 16, 2)->default(0.00);
            $table->double('HJ2', 16, 2)->default(0.00);
            $table->double('HJ3', 16, 2)->default(0.00);
            $table->date('EXPIRED')->default('1900-01-01');
            $table->date('TGL_MASUK')->default('1900-01-01');
            $table->longText('FOTO')->nullable();
            $table->double('BERAT', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT1', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT2', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT3', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT4', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT5', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT6', 16, 2)->default(0.00);
            $table->double('HJ_TINGKAT7', 16, 2)->default(0.00);
            $table->double('MIN_TINGKAT1', 16, 0)->default(0);
            $table->double('MIN_TINGKAT2', 16, 0)->default(0);
            $table->double('MIN_TINGKAT3', 16, 0)->default(0);
            $table->double('MIN_TINGKAT4', 16, 0)->default(0);
            $table->double('MIN_TINGKAT5', 16, 0)->default(0);
            $table->double('MIN_TINGKAT6', 16, 0)->default(0);
            $table->double('MIN_TINGKAT7', 16, 0)->default(0);

            $table->index('KODE');
            $table->index('NAMA');
            $table->index('GOLONGAN');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('stock');
    }
}
