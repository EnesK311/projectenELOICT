<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class AssessmentRubric extends Pivot
{
    use HasFactory;

    protected $table = 'assessment_rubric';
    protected $fillable = [
        'assessment_id',
        'rubric_id',
        'weight'
    ];

    /* public function assessment()
     {
         return $this->belongsTo(Assessment::class, 'assessment_id');
     }
*/
    public function rubric()
    {
        return $this->belongsTo(Rubric::class, 'rubric_id');
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'assessment_rubric_id');
    }
}