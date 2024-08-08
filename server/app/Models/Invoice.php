<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'subtotal',
        'tax',
        'amount_paid',
    ];

    protected $casts = [
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
}
