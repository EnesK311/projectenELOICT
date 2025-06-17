<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveScore extends Model
{
    use HasFactory;
    protected $table = 'livescores';
    protected $primaryKey = 'result_id';


    protected $fillable = [
        'user_id',
        'result_id',
        'home_team_score',
        'away_team_score',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function match()
    {
        return $this->belongsTo(Result::class);
    }
}