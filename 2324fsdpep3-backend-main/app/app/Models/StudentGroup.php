<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StudentGroup extends Pivot
{
    use HasFactory;

    protected $fillable = ['assessment_id'];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class);
    }

    public function groupMembers()
    {
        return $this->hasMany(GroupMember::class);
    }
}