<?php

namespace App\Http\Controllers;

use App\Models\StudentGroup;
use Illuminate\Http\Request;

class StudentGroupController extends Controller
{
    public function index()
    {
        return StudentGroup::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'assessment_id' => 'required|exists:assessments,id',
        ]);

        $group = StudentGroup::create($request->all());

        return response()->json($group, 201);
    }

    public function show($id)
    {
        return StudentGroup::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $group = StudentGroup::findOrFail($id);
        $group->update($request->all());

        return response()->json($group, 200);
    }

    public function destroy($id)
    {
        StudentGroup::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}