<?php

namespace App\Models;

use App\Observers\NotaServiceObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([NotaServiceObserver::class])]
class NotaService extends Model
{
    use HasFactory;

    protected $table = 'notaservice';
    protected $primaryKey = 'ID';
    public $timestamps = false;

    protected $fillable = [
        'STATUS',
        'FAKTUR',
        'KODE',
        'TGL',
        'TGLBAYAR',
        'PEMILIK',
        'NOTELEPON',
        'ESTIMASISELESAI',
        'ESTIMASIHARGA',
        'HARGA',
        'NOMINALBAYAR',
        'DP',
        'PENERIMA',
        'DATETIME',
        'USERNAME'
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

    public function barangList()
    {
        return $this->hasMany(BarangService::class, 'KODE_SERVICE', 'KODE');
    }

    public function selectedServices()
    {
        return $this->hasMany(SparepartService::class, 'KODE_SERVICE', 'KODE');
    }

    public function queue()
    {
        return $this->morphOne(Queue::class, 'queueable');
    }

    public function getANTRIANAttribute()
    {
        return 'A' . str_pad($this->attributes['ANTRIAN'], 2, '0', STR_PAD_LEFT);
    }

    public function getORIGINALANTRIANAttribute()
    {
        return $this->attributes['ANTRIAN'];
    }
}
