<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotaServiceQueue extends Model
{
    use HasFactory;

    protected $table = 'view_notaservice_queue'; // This refers to the view

    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'ID', 'STATUS', 'FAKTUR', 'KODE', 'TGL', 'TGLBAYAR', 'PEMILIK', 'NOTELEPON',
        'ESTIMASISELESAI', 'ESTIMASIHARGA', 'HARGA', 'NOMINALBAYAR', 'DP',
        'PENERIMA', 'DATETIME', 'USERNAME', 'QUEUE_NUMBER'
    ];
}
