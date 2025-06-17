<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Picture extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'result_id',
        'path',
    ];

    /**
     * Get the match that owns the picture.
     */
    public function result(): BelongsTo
    {
        return $this->belongsTo(Result::class);
    }

    /**
     * Get the user that owns the picture.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
