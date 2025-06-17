<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function assessments()
    {
        return $this->hasMany(Assessment::class, 'created_by');
    }
    public function createdAssessments()
    {
        return $this->hasMany(Assessment::class, 'created_by');
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_user');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function givenScores()
    {
        return $this->hasMany(Score::class, 'given_by');
    }

    public function opos()
    {
        return $this->belongsToMany(Opo::class, 'user_opos');
    }
}