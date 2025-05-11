<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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

    public function category() {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function molds() {
        return $this->belongsToMany(Mold::class, 'item_mold');
    }
}
