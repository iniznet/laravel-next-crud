<?php

namespace App\Models;

use App\Observers\InvoiceObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([InvoiceObserver::class])]
class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'invoice_date',
        'due_date',
        'from',
        'phone_number',
        'notes',
        'queued',
        'subtotal',
        'tax',
        'amount_paid',
    ];

    protected $casts = [
        'queued' => 'boolean',
        'invoice_date' => 'datetime',
        'due_date' => 'datetime',
        'subtotal' => 'float',
        'tax' => 'float',
        'amount_paid' => 'float',
    ];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function queue()
    {
        return $this->morphOne(Queue::class, 'queueable');
    }
}
