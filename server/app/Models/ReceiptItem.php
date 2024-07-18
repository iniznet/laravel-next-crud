<?php

namespace App\Models;

use App\Enums\ReceiptStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReceiptItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'receipt_id',
        'item_type',
        'item_id',
        'description',
        'status',
    ];

    protected $casts = [
        'status' => ReceiptStatus::class,
    ];

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }
}
