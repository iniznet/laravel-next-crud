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
        DB::statement('
            CREATE VIEW view_notaservice_queue AS
            SELECT 
                `notaservice`.`ID` AS `ID`,
                `notaservice`.`ESTIMASIHARGA` AS `ESTIMASIHARGA`,
                `notaservice`.`HARGA` AS `HARGA`,
                `notaservice`.`NOMINALBAYAR` AS `NOMINALBAYAR`,
                `notaservice`.`DP` AS `DP`,
                CASE
                    WHEN (
                        (
                            CASE
                                WHEN (`notaservice`.`HARGA` > `notaservice`.`ESTIMASIHARGA`) OR (`notaservice`.`ESTIMASIHARGA` <= 0) THEN `notaservice`.`HARGA`
                                ELSE `notaservice`.`ESTIMASIHARGA`
                            END
                        ) - (`notaservice`.`NOMINALBAYAR` + `notaservice`.`DP`)
                    ) > 0 THEN ROW_NUMBER() OVER (ORDER BY `notaservice`.`ID`)
                    ELSE NULL
                END AS `QUEUE_NUMBER`
            FROM `notaservice`
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS `view_notaservice_queue`');
    }
};
