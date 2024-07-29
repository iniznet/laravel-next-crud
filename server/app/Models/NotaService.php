<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotaService extends Model
{
    use HasFactory;

    protected $table = 'notaservice';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'STATUS', 'FAKTUR', 'KODE', 'TGL', 'TGLBAYAR', 'PEMILIK', 'NOTELEPON',
        'ESTIMASISELESAI', 'ESTIMASIHARGA', 'HARGA', 'NOMINALBAYAR', 'DP',
        'PENERIMA', 'DATETIME', 'USERNAME'
    ];

    protected $casts = [
        'TGL' => 'date',
        'TGLBAYAR' => 'date',
        'ESTIMASISELESAI' => 'date',
        'DATETIME' => 'datetime'
    ];
}
