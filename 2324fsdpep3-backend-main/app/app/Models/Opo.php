<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opo extends Model
{
    use HasFactory;

    protected $fillable = ['name'];


    public function assessments()
    {
        return $this->hasMany(Assessment::class);
    }

    public function groups()
    {
        return $this->hasMany(Group::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_opos');
    }
}