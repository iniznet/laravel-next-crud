<?php

namespace App\Models;

use App\Enums\QueueState;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'queueable_id',
        'queueable_type',
        'number',
        'state',
        'called_at',
    ];

    protected $casts = [
        'state' => QueueState::class,
        'called_at' => 'datetime',
    ];

    protected $hidden = [
        'queueable_id',
        'queueable_type',
    ];

    public function queueable()
    {
        return $this->morphTo();
    }

    public function getName()
    {
        return match ($this->queueable_type) {
            NotaService::class => $this->queueable->PEMILIK,
            Invoice::class => $this->queueable->from,
            default => null,
        };
    }
}
