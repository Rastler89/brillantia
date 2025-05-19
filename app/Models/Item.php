<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $fillable = [
        'name',
        'image',
        'materials',
        'weight',
        'quantity',
        'price',
        'description',
        'is_active',
        'category_id'
    ];

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function molds(): BelongsToMany {
        return $this->belongsToMany(Mold::class, 'item_mold');
    }

    public function saleItems(): HasMany {
        return $this->hasMany(SaleItem::class);
    }
}
