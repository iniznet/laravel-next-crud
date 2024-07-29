<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SparepartService extends Model
{
    use HasFactory;

    protected $table = 'sparepartservice';
    public $timestamps = false;

    protected $fillable = [
        'KODE_SERVICE', 'KODE_BARANG', 'KODE', 'HARGA', 'STATUS'
    ];
}
