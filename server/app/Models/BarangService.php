<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangService extends Model
{
    use HasFactory;

    protected $table = 'barangservice';
    protected $primaryKey = 'KODE_SERVICE';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'KODE_SERVICE', 'KODE', 'NAMA', 'KETERANGAN', 'QTY', 'STATUSAMBIL'
    ];

    public function notaService()
    {
        return $this->belongsTo(NotaService::class, 'KODE', 'KODE_SERVICE');
    }

    public function services()
    {
        return $this->hasMany(SparepartService::class, 'KODE_BARANG', 'KODE');
    }
}
