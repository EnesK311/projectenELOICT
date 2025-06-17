<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Map extends Model
{
    use HasFactory;

    public $timestamps = false;

    // relations
    public function duels(): BelongsToMany {
        return $this->belongsToMany(Duel::class);
    }
}
