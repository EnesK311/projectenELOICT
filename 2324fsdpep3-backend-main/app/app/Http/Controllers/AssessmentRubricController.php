<?php

// app/Http/Controllers/AssessmentRubricController.php

namespace App\Http\Controllers;

use App\Models\AssessmentRubric;
use Illuminate\Http\Request;

class AssessmentRubricController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
            'rubric_id' => 'required|exists:rubrics,id',
            'weight' => 'required|integer|min:1|max:100',
        ]);

        $assessmentRubric = AssessmentRubric::create($request->all());

        return response()->json($assessmentRubric, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'weight' => 'required|integer', // Validate the weight
        ]);

        $assessmentRubric = AssessmentRubric::findOrFail($id);
        $assessmentRubric->update($request->all());

        return response()->json($assessmentRubric, 200);
    }
}