<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Duel extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    // relations
    public function map(): HasOne {
        return $this->hasOne(Map::class);
    }

    public function gamemode(): HasOne {
        return $this->hasOne(Gamemode::class);
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }
}
