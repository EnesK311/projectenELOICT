<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'status',
        'name',
        'location',
        'address',
        'phone1',
        'phone2',
        'email',
        'lat',
        'lng',
    ];

    public function results()
    {
        return $this->hasMany(Result::class, 'sportshall_id');
    }
}