<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        return Team::all();
    }

    public function show($id)
    {
        return Team::findOrFail($id);
    }

    public function players($id)
    {
        $team = Team::with('players')->findOrFail($id);
        return $team->players;
    }

    public function results($id)
    {
        $team = Team::findOrFail($id);
        $results = $team->resultsAsTeam1()->union($team->resultsAsTeam2())->get();
        return $results;
    }

    public function search(Request $request)
    {
        $name = $request->query('name');
        if (!$name) {
            return response()->json(['error' => 'Name parameter required'], 400);
        }

        return Team::where('name', 'LIKE', "%{$name}%")->get();
    }
}