<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public $timestamps = false;

    public function getValueAttribute($value) {
        return json_decode($value,true) ?? $value;
    }

    public function setValueAttribute($value) {
        $this->attributes['value'] = is_array($value) ? json_encode($value) : $value;
    }

    public static function get($key, $default = null) {
        return static::where('key',$key)->first()->value ?? $default;
    }

    public static function set($key, $value) {
        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }

}
