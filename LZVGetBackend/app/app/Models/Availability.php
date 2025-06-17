<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'result_id',
        'available',
    ];

    protected $casts = [
        'available' => 'boolean',
    ];

    /**
     * Get the user that has the availability.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    /**
     * Get the match that has the availability.
     */
    public function match(): BelongsTo
    {
        return $this->belongsTo(Result::class, 'result_id');
    }

}