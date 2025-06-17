<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'group_id',
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }

    public function opo()
    {
        return $this->belongsTo(Opo::class, 'opo_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_user');
    }

}