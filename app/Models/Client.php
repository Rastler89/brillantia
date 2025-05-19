<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $fillable = [
        'name',
        'dni_nif',
        'email',
        'phone',
        'address',
        'is_shop'
    ];

    public function sales(): HasMany {
        return $this->hasMany(Sale::class);
    }
}
