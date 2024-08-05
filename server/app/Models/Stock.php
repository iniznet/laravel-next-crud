<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'stock';

    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'GUDANG', 'KODE', 'KODE_TOKO', 'NAMA', 'JENIS', 'GOLONGAN', 'RAK', 'DOS', 'SATUAN', 'SATUAN2', 'SATUAN3', 'SUPPLIER',
        'ISI', 'ISI2', 'DISCOUNT', 'PAJAK', 'MIN', 'MAX', 'HB', 'HB2', 'HB3', 'HJ', 'HJ2', 'HJ3', 'EXPIRED', 'TGL_MASUK', 'FOTO',
        'BERAT', 'HJ_TINGKAT1', 'HJ_TINGKAT2', 'HJ_TINGKAT3', 'HJ_TINGKAT4', 'HJ_TINGKAT5', 'HJ_TINGKAT6', 'HJ_TINGKAT7',
        'MIN_TINGKAT1', 'MIN_TINGKAT2', 'MIN_TINGKAT3', 'MIN_TINGKAT4', 'MIN_TINGKAT5', 'MIN_TINGKAT6', 'MIN_TINGKAT7',
    ];
}
