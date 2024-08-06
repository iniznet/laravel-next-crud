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

    protected $with = ['barang', 'service'];

    public function notaService()
    {
        return $this->belongsTo(NotaService::class, 'KODE_SERVICE', 'KODE');
    }

    public function barang()
    {
        return $this->belongsTo(Stock::class, 'KODE', 'KODE');
    }

    public function service()
    {
        return $this->belongsTo(MasterJasa::class, 'KODE', 'KODE');
    }
}
