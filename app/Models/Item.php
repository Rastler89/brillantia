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
    ];
}
