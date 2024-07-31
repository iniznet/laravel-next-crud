<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MasterJasa extends Model
{
    use HasFactory;

    protected $table = 'master_jasa';
    protected $primaryKey = 'KODE';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'KODE', 'KETERANGAN', 'ESTIMASIHARGA'
    ];

    protected $casts = [
        'ESTIMASIHARGA' => 'float'
    ];
}
