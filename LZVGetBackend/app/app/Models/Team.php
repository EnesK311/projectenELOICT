<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'website',
        'shirt_color',
        'shorts_color',
        'team_info',
        'delay_home_max',
        'delay_days_home_max',
        'delay_days_away_max',
        'last_login_at',
    ];

    public function players()
    {
        return $this->hasMany(User::class);
    }

    public function resultsAsTeam1()
    {
        return $this->hasMany(Result::class, 'team1_id');
    }

    public function resultsAsTeam2()
    {
        return $this->hasMany(Result::class, 'team2_id');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'team1_id')
            ->union($this->hasMany(Result::class, 'team2_id')->getQuery());
    }
}