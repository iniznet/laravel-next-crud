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

    protected $casts = [
        'HARGA' => 'float'
    ];

    public function notaService()
    {
        return $this->belongsTo(NotaService::class, 'KODE_SERVICE', 'KODE');
    }
}
