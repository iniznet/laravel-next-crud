<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->dateTime('invoice_date');
            $table->dateTime('due_date')->nullable();
            $table->string('from');
            $table->string('phone_number');
            $table->text('notes')->nullable();
            $table->decimal('subtotal', 16, 2);
            $table->decimal('tax', 5, 2)->default(0);
            $table->decimal('amount_paid', 16, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('invoices');
    }
};
