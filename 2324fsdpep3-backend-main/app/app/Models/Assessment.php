<?php

namespace App\Models;

use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Laravel\ServiceProvider;
use Carbon\Carbon;

class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'opo_id',
        'end_date',
        'notification_days',
        'is_result_visible'
    ];


    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /*public function rubrics()
    {
        return $this->hasMany(AssessmentRubric::class, 'assessment_id');
    }*/

    public function rubrics()
    {
        return $this->belongsToMany(Rubric::class, 'assessment_rubric', 'assessment_id', 'rubric_id')
            ->withPivot('id', 'weight');
    }
    public function opo()
    {
        return $this->belongsTo(Opo::class);
    }

    public function groups()
    {
        return $this->opo->groups();
    }

    public function scores()
    {
        return $this->hasMany(Score::class, 'assessment_id');
    }

    //not sure about these

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function getStateStudent($assessmentId)
    {
        $user = auth()->user();
        $assessment = Assessment::find($assessmentId);

        $lastScore = Score::where('user_id', $user->id)
            ->where('assessment_id', $assessmentId)
            ->orderBy('created_at', 'desc')
            ->first();

        // Check if results are visible
        if ($assessment->is_result_visible == 1) {
            return 'green';
        }

        // Check score status
        if ($lastScore == null) {
            return 'red';
        }

        if ($lastScore->score != null) {
            return 'orange';
        }

        return 'red';
    }

    public function getStateTeacher($assessmentId)
    {
        $assessment = Assessment::find($assessmentId);

        if (!$assessment) {
            throw new \Exception('Assessment not found.');
        }

        // Check if results are visible
        if ($assessment->is_result_visible == 1) {
            return 'green';
        }

        $scores = Score::where('assessment_id', $assessmentId)->get();

        // Check if all scores are filled
        $allFilled = true;
        foreach ($scores as $score) {
            if ($score->score == null) {
                $allFilled = false;
            }
        }

        if ($allFilled) {
            return 'orange';
        }

        return 'red';
    }

}