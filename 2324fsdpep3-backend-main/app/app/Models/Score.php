<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'assessment_id',
        'group_member_id',
        'assessment_rubric_id',
        'given_by',
        'score'
    ];

    public function assessment()
    {
        return $this->belongsTo(Assessment::class, 'assessment_id');
    }

    // This relationship should use 'assessment_rubric_id', not 'rubric_id'
    public function assessmentRubric()
    {
        return $this->belongsTo(AssessmentRubric::class, 'assessment_rubric_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function givenBy()
    {
        return $this->belongsTo(User::class, 'given_by');
    }
}