<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rubric extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_fixed'];

    public function assessments()
    {
        return $this->belongsToMany(Assessment::class, 'assessment_rubric', 'rubric_id', 'assessment_id');
    }
    public function assessmentRubrics()
    {
        return $this->hasMany(AssessmentRubric::class, 'rubric_id');
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }
}