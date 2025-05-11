<?php

namespace App\Models;

use App\MoldStatus;
use Illuminate\Database\Eloquent\Model;

class Mold extends Model
{
    protected $fillable = [
        'name',
        'reference',
        'localization',
        'description',
        'image',
        'status'
    ];

    protected $casts = [
        'status' => MoldStatus::class,
    ];

    public function items() {
        return $this->belongsToMany(Item::class, 'item_mold');
    }
}
