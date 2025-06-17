<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $fillable = [
        'name',
        'code',
        'top',
        'bot',
        'region_id',
        'alternate_division_id',
        'season_id',
    ];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }
}