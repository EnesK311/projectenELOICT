<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skin extends Model
{
    use HasFactory;

    public $timestamps = false;

    // relations
    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class);
    }
}
