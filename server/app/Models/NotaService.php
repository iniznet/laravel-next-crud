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
        'ESTIMASIHARGA' => 'float',
        'HARGA' => 'float',
        'NOMINALBAYAR' => 'float',
        'DP' => 'float',
        'DATETIME' => 'datetime'
    ];

    public function queue()
    {
        return $this->hasOne(NotaServiceQueue::class, 'ID', 'ID')->select('ID', 'QUEUE_NUMBER');
    }

    public function barangList()
    {
        return $this->hasMany(BarangService::class, 'KODE_SERVICE', 'KODE');
    }

    public function selectedServices()
    {
        return $this->hasMany(SparepartService::class, 'KODE_SERVICE', 'KODE');
    }
}
