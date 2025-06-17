<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;

use App\Helpers\DivisionHelper;

class DivisionController extends Controller
{
    public function index()
    {
        return Division::all();
    }

    public function show($id)
    {
        return Division::findOrFail($id);
    }

    public function results($id)
    {
        $division = Division::with('results')->findOrFail($id);
        return $division->results;
    }

    public function getTable($divisionId)
    {
        $table = DivisionHelper::getDivisionTable($divisionId);
        return response()->json($table);
    }

    public function getDivisionName($divisionId)
    {
        $division = Division::findOrFail($divisionId);
        return response()->json(['name' => $division->name]);
    }

}