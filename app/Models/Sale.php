<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    protected $fillable = [
        'client_id',
        'user_id',
        'amount',
        'status',
        'payment_method',
        'notes',
        'paid_at',
        'is_direct'
    ];

    public function client(): BelongsTo {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany {
        return $this->hasMany(SaleItem::class);
    }
}
