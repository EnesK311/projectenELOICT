<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    protected $fillable = [
        'status',
        'notification',
        'division_id',
        'sportshall_id',
        'team1_id',
        'team2_id',
        'score1',
        'score2',
        'score3',
        'score4',
        'forfeit',
        'forfeit_at',
        'planned_at',
        'planned_orig_at',
        'season_id',
        'delayed_request',
        'delayed_status',
        'delayed_prop_at',
        'delayed_prop_count',
    ];

    public function division()
    {
        return $this->belongsTo(Division::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'sportshall_id');
    }

    public function team1()
    {
        return $this->belongsTo(Team::class, 'team1_id');
    }

    public function team2()
    {
        return $this->belongsTo(Team::class, 'team2_id');
    }
    public function pictures()
    {
        return $this->hasMany(Picture::class);
    }
    public function availabilities()
    {
        return $this->hasMany(Availability::class);
    }

}