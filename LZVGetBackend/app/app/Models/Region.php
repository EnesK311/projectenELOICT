<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = [
        'status',
        'name',
        'code',
        'province_id',
    ];

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }
}