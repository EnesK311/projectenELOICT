<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // Add this line

use App\Models\Assessment;
use App\Models\User;

class ScoreController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'group_member_id' => 'required|exists:group_members,id',
            'rubric_id' => 'required|exists:rubrics,id',
            'given_by' => 'required|exists:users,id',
            'score' => 'required|integer',
        ]);

        $score = Score::create($request->all());

        return response()->json($score, 201);
    }

    //getting to this step means all necessary stuff are already created
    //the OPO exists and users are added. 
    //the assessment is created
    //rubrics are created and weights to these rubrics are added
    //everything is already in the database.
    //now I need to get everything that I created via the assessment ID I receive here and request it all.
    //when I have all rubrics and all groups with the user I can assign every rubric per user per receiver
    public function createAllScores(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id'
        ]);

        $assessment = Assessment::find($request->assessment_id);
        $opo = $assessment->opo;
        $groups = $opo->groups;
        $rubrics = $assessment->rubrics;
        foreach ($groups as $group) {
            $users = $group->users; // Get all users in the group

            foreach ($users as $userGivingScore) { // The user giving the score
                foreach ($users as $userReceivingScore) { // The user receiving the score
                    foreach ($rubrics as $rubric) {
                        $score = new Score();
                        $score->assessment_id = $assessment->id;
                        $score->group_id = $group->id;
                        $score->user_id = $userReceivingScore->id;
                        $score->assessment_rubric_id = $rubric->pivot->id;
                        $score->given_by = $userGivingScore->id;
                        $score->score = null;
                        $score->save();
                    }
                }
            }
        }
        return response()->json(['message' => 'All scores created'], 201);
    }
    // we need to be able to get all scores that this user received and return it to him IF he is allowed if the assessment date isnt finished is_available = 0 we cant return results
    //based on the weight per rubric we need to calculate a gemiddelde score
    public function getScores($id)
    {
        $scores = Score::where('group_member_id', $id)->get();
        return response()->json($scores, 200);
    }

    //function for teachers where they can see all results submitted in an assessment
    public function getScoresForTeachers($id)
    {
        $scores = Score::where('assessment_id', $id)
            ->with(['user', 'givenBy', 'assessmentRubric.rubric']) // Ensure these relationships are loaded
            ->get();

        Log::info($scores->toArray()); // Log the raw data to inspect what's being returned

        $transformedScores = $scores->map(function ($score) {
            return [
                'id' => $score->id,
                'assessment_id' => $score->assessment_id,
                'assessment' => $score->assessment->title,
                'group_id' => $score->group_id,
                'group' => $score->assessment->opo->name,
                'user' => $score->user->firstname . ' ' . $score->user->lastname,
                'rubric_name' => $score->assessmentRubric && $score->assessmentRubric->rubric ? $score->assessmentRubric->rubric->name : 'N/A', // The rubric name
                'given_by_name' => $score->givenBy->firstname . ' ' . $score->givenBy->lastname,
                'score' => $score->score,
            ];
        });

        return response()->json($transformedScores, 200);
    }

    public function getScoresForStudents(Request $request, $id)
    {
        $scores = Score::where('assessment_id', $id)
            ->where('given_by', $request->user()->id)
            ->with(['assessmentRubric.rubric', 'user', 'givenBy'])
            ->get();

        // Group scores by rubric name
        $groupedScores = $scores->groupBy(function ($score) {
            return $score->assessmentRubric->rubric->name ?? 'Unknown Rubric';
        });

        // Transform the grouped data
        $transformedScores = $groupedScores->map(function ($group, $rubric) {
            return $group->map(function ($score) {
                return [
                    'id' => $score->id,
                    'user' => $score->user->firstname . ' ' . $score->user->lastname,
                    'given_by' => $score->givenBy->firstname . ' ' . $score->givenBy->lastname,
                    'score' => $score->score,
                ];
            });
        });

        return response()->json($transformedScores, 200);
    }

    //submitting scores a user filled in
    public function submitScores(Request $request, $assessment)
    {
        // Validate the request
        $validatedData = $request->validate([
            'scores' => 'required|array',
            'scores.*.id' => 'required|exists:scores,id', // Ensure each score ID exists in the database
            'scores.*.score' => 'required|numeric|min:0|max:100', // Ensure the score is between 0 and 100
        ]);

        // Loop through the scores and update each one
        foreach ($validatedData['scores'] as $scoreData) {
            $score = Score::find($scoreData['id']); // Find the score by ID
            $score->update(['score' => $scoreData['score']]); // Update the score
        }

        return response()->json(['message' => 'Scores submitted successfully!'], 200);
    }

    public function getScoresForAnalytics($id)
    {
        //return message to see if I get in here

        //return response()->json('got inside function in backend', 201);
        //Get user id from api call
        $user = User::findOrFail($id);

        $scores = Score::where('user_id', $user->id)
            ->whereNotNull('score')
            ->with(['assessmentRubric.rubric'])
            ->get();

        $groupedScores = $scores->groupBy(function ($score) {
            return $score->assessmentRubric->rubric->name ?? 'Unknown Rubric';
        });

        // Transform the grouped data
        $transformedScores = $groupedScores->map(function ($group, $rubric) {
            return $group->map(function ($score) {
                return [
                    'date' => $score->updated_at,
                    'score' => $score->score,
                ];
            });
        });

        // Group scores by rubric name

        return response()->json(['scores' => $transformedScores]);
    }
}