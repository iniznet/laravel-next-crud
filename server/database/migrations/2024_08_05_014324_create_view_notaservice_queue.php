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
        // Drop the view if it already exists
        DB::statement('DROP VIEW IF EXISTS view_notaservice_queue');

        // Create the view
        DB::statement("
            CREATE VIEW view_nota_service_queue AS
            SELECT
                ID,
                ESTIMASIHARGA,
                HARGA,
                NOMINALBAYAR,
                DP,
                CASE
                    -- Calculate QUEUE_NUMBER if BASE_AMOUNT minus NOMINALBAYAR and DP is greater than 0
                    WHEN (CASE
                        WHEN HARGA > ESTIMASIHARGA OR ESTIMASIHARGA <= 0 THEN HARGA
                        ELSE ESTIMASIHARGA
                    END - (NOMINALBAYAR + DP)) > 0 THEN ROW_NUMBER() OVER (ORDER BY ID)
                    -- Otherwise, set QUEUE_NUMBER to NULL
                    ELSE NULL
                END AS QUEUE_NUMBER
            FROM notaservice
            WHERE (CASE
                    WHEN HARGA > ESTIMASIHARGA OR ESTIMASIHARGA <= 0 THEN HARGA
                    ELSE ESTIMASIHARGA
                END - (NOMINALBAYAR + DP)) > 0;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS `view_notaservice_queue`');
    }
};
