<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\AssessmentResource;
use App\Models\Opo;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Csv;
use App\Models\Score;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssessmentController extends Controller
{
    public function index()
    {
        // Get user from auth
        $user = auth()->user();
        try {
            if ($user->role === 'teacher') {
                $assessments = Assessment::with(['createdBy', 'opo'])
                    ->where('created_by', $user->id)
                    ->get();
            } else if ($user->role === 'student') {
                $groupIds = $user->groups->pluck('id');

                // Use whereHas to filter by related groups
                $opoIds = Opo::whereHas('groups', function ($query) use ($groupIds) {
                    $query->whereIn('groups.id', $groupIds);
                })->pluck('id');

                $assessments = Assessment::with(['createdBy', 'opo'])
                    ->whereIn('opo_id', $opoIds)
                    ->get();
            } else if ($user->role === 'admin') {
                $assessments = Assessment::with(['createdBy', 'opo'])->get();
            } else {
                return response()->json(['error' => 'Invalid user role'], 403);
            }

            // Return the assessments as a resource collection
            return AssessmentResource::collection($assessments);

        } catch (\Exception $e) {
            \Log::error('Error fetching assessments: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    //$assessments = Assessment::with(['createdBy', 'opo'])->get();

    public function exportAssessment($id)
    {

        $user = auth()->user();
        if ($user->role !== 'admin' && $user->role !== 'teacher') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $assessment = Assessment::with(['opo.groups.users', 'rubrics'])->findOrFail($id);
        $opo = $assessment->opo;
        $groups = $opo->groups;
        $rubrics = $assessment->rubrics;

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $row = 1;

        foreach ($groups as $group) {
            $sheet->setCellValue('A' . $row, 'Group: ' . $group->title);
            $row++;

            foreach ($rubrics as $rubric) {
                $weight = $rubric->pivot->weight;

                $sheet->setCellValue('A' . $row, $rubric->name . " (Weight: " . $weight . ")");
                $row++;

                $sheet->setCellValue('A' . $row, 'User Giving')
                    ->setCellValue('B' . $row, 'User Receiving')
                    ->setCellValue('C' . $row, 'Score');
                $row++;

                foreach ($group->users as $userGivingScore) {
                    foreach ($group->users as $userReceivingScore) {
                        $score = Score::where([
                            'assessment_id' => $assessment->id,
                            'group_id' => $group->id,
                            'user_id' => $userReceivingScore->id,
                            'assessment_rubric_id' => $rubric->pivot->id,
                            'given_by' => $userGivingScore->id
                        ])->first();

                        $sheet->setCellValue('A' . $row, $userGivingScore->firstname)
                            ->setCellValue('B' . $row, $userReceivingScore->firstname)
                            ->setCellValue('C' . $row, $score->score ?? 'N/A');
                        $row++;
                    }
                }
                $row++;
            }
            $row++;
        }

        // Stream the file content as a response
        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Csv($spreadsheet);
            $writer->save('php://output');
        });

        // Set the appropriate headers for file download
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment;filename="assessment_' . $assessment->id . '.csv"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }

    public function CalculateResults($id)
    {
        $assessment = Assessment::with(['rubrics'])->findOrFail($id);

        $user = auth()->user();

        if ($assessment->is_result_visible == 0) {
            return response()->json(['error' => 'This assessment is not finished yet'], 403);
        }

        if ($user->role === 'teacher' && $assessment->createdBy->id === $user->id || $user->role === 'admin') {
            $results = [];

            foreach ($assessment->opo->groups as $group) {
                $groupSize = $group->users->count();

                foreach ($group->users as $student) {
                    $rubricResults = [];
                    $totalWeightedScore = 0;
                    $totalWeight = 0;

                    foreach ($assessment->rubrics as $rubric) {
                        $scores = Score::where('user_id', $student->id)
                            ->where('assessment_id', $assessment->id)
                            ->where('assessment_rubric_id', $rubric->pivot->id)
                            ->where('given_by', '!=', $student->id)
                            ->get();

                        $averageScore = $scores->avg('score');
                        $selfAssessmentScore = Score::where('user_id', $student->id)
                            ->where('assessment_id', $assessment->id)
                            ->where('assessment_rubric_id', $rubric->pivot->id)
                            ->where('given_by', $student->id)
                            ->first();

                        $weight = $rubric->pivot->weight;
                        $weightedScore = $averageScore * $weight;
                        $totalWeightedScore += $weightedScore;
                        $totalWeight += $weight;

                        $rubricResults[] = [
                            'rubric' => $rubric->name,
                            'average_score' => $averageScore,
                            'self_assessment_score' => $selfAssessmentScore->score ?? null,
                            'weight' => $weight,
                            'weighted_score' => $weightedScore,
                        ];
                    }

                    $finalScore = $totalWeight > 0 ? $totalWeightedScore / $totalWeight : null;

                    $adjustedFinalScore = $finalScore !== null ? $finalScore * $groupSize : null;

                    $results[] = [
                        'student' => $student->firstname . ' ' . $student->lastname,
                        'rubric_results' => $rubricResults,
                        'final_score' => $adjustedFinalScore,
                    ];
                }
            }

            //add resource HERE
            return response()->json($results);
        }

        if ($user->role === 'student') {
            $groupIds = $user->groups->pluck('id');
            $opoIds = Opo::whereHas('groups', function ($query) use ($groupIds) {
                $query->whereIn('groups.id', $groupIds);
            })->pluck('id');

            if ($opoIds->contains($assessment->opo_id)) {
                $rubricResults = [];
                $totalWeightedScore = 0;
                $totalWeight = 0;

                $groupSize = $user->groups->first()->users->count();

                foreach ($assessment->rubrics as $rubric) {
                    $scores = Score::where('user_id', $user->id)
                        ->where('assessment_id', $assessment->id)
                        ->where('assessment_rubric_id', $rubric->pivot->id)
                        ->where('given_by', '!=', $user->id)
                        ->get();

                    $averageScore = $scores->avg('score');
                    $selfAssessmentScore = Score::where('user_id', $user->id)
                        ->where('assessment_id', $assessment->id)
                        ->where('assessment_rubric_id', $rubric->pivot->id)
                        ->where('given_by', $user->id)
                        ->first();

                    $weight = $rubric->pivot->weight;
                    $weightedScore = $averageScore * $weight;
                    $totalWeightedScore += $weightedScore;
                    $totalWeight += $weight;

                    $rubricResults[] = [
                        'rubric' => $rubric->name,
                        'average_score' => $averageScore,
                        'self_assessment_score' => $selfAssessmentScore->score ?? null,
                        'weight' => $weight,
                        'weighted_score' => $weightedScore,
                    ];
                }

                $finalScore = $totalWeight > 0 ? $totalWeightedScore / $totalWeight : null;

                $adjustedFinalScore = $finalScore !== null ? $finalScore * $groupSize : null;

                return response()->json([
                    'rubric_results' => $rubricResults,
                    'final_score' => $adjustedFinalScore,
                ]);
            }
        }

        return response()->json(['error' => 'Unauthorized access or no results found'], 403);
    }


    public function store(Request $request)
    {
        //get user id
        $user = auth()->user();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'notification_days' => 'required|integer|min:0',
            'opo_id' => 'required|exists:opos,id',
            'end_date' => 'required|date',
        ]);

        //add user id into request
        $request->merge(['created_by' => $user->id]);
        $assessment = Assessment::create($request->all());


        $assessment->save();
        return response()->json($assessment, 201);
    }

    public function show($id)
    {
        return Assessment::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $assessment = Assessment::findOrFail($id);
        $assessment->update($request->all());

        return response()->json($assessment, 200);
    }

    public function destroy($id)
    {
        Assessment::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}