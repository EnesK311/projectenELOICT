<?php

namespace App\Http\Controllers;

use App\Models\Rubric;
use Illuminate\Http\Request;

class RubricController extends Controller
{
    public function index()
    {
        //only return rubrics that have is_fixed value 1 
        return Rubric::where('is_fixed', 1)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'is_fixed' => 'required|boolean',
        ]);
        $rubric = Rubric::create($request->all());

        return response()->json($rubric, 201);
    }

    public function show($id)
    {
        return Rubric::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $rubric = Rubric::findOrFail($id);
        $rubric->update($request->all());

        return response()->json($rubric, 200);
    }

    public function destroy($id)
    {
        Rubric::findOrFail($id)->delete();

        return response()->json(null, 204);
    }
}