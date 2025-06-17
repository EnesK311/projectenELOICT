<?php

namespace App\Http\Controllers\Api;

use App;
use App\Http\Controllers\Controller;
use App\Models\Result;
use Carbon\Carbon;
use App\Helpers;
use App\Helpers\DivisionHelper;
use App\Helpers\TeamHelper;

class ResultController extends Controller
{
    public function index()
    {
        return Result::all();
    }

    public function show($id)
    {
        return Result::findOrFail($id);
    }

    public function byDivision($division_id)
    {
        $results = Result::where('division_id', $division_id)
            ->where('planned_at', '>', Carbon::now())
            ->with(['team1', 'team2', 'location'])
            ->orderBy('planned_at', 'asc')
            ->take(3)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found for this division.'], 404);
        }

        foreach ($results as $result) {
            if ($result->team1) {
                $result->team1->last5Record = TeamHelper::getTeamWinLossRecord($result->team1_id);
            }
            if ($result->team2) {
                $result->team2->last5Record = TeamHelper::getTeamWinLossRecord($result->team2_id);
            }
        }

        return $results;
    }

    public function recentmatchesdivision($id)
    {
        $results = Result::where('division_id', $id)
            ->where('planned_at', '<', Carbon::now())
            ->with(['team1', 'team2', 'location'])
            ->orderBy('planned_at', 'desc')
            ->take(3)
            ->get();

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No results found for this division.'], 404);
        }

        foreach ($results as $result) {
            if ($result->team1) {
                $result->team1->last5Record = TeamHelper::getTeamWinLossRecord($result->team1_id);
            }
            if ($result->team2) {
                $result->team2->last5Record = TeamHelper::getTeamWinLossRecord($result->team2_id);
            }
        }

        return $results;
    }

    public function recent()
    {

        //Get user
        $user = auth()->user();
        //get team
        $team = $user->team;

        //get the recently played 3 matches for the team
        $results = Result::where(function ($query) use ($team) {
            $query->where('team1_id', $team->id)
                ->orWhere('team2_id', $team->id);
        })
            ->where('planned_at', '<', Carbon::now())
            ->with(['team1', 'team2', 'location'])
            ->orderBy('planned_at', 'desc')
            ->take(3)
            ->get();


        return $results;
    }



    public function byTeam($team_id)
    {
        // Matches where the team appears as team1 or team2
        return Result::where('team1_id', $team_id)
            ->orWhere('team2_id', $team_id)
            ->get();
    }

    public function byLocation($location_id)
    {
        return Result::where('sportshall_id', $location_id)->get();
    }

    public function forfeited()
    {
        return Result::where('forfeit', true)->get();
    }

    public function upcoming()
    {
        // Matches planned in the future with team names
        return Result::where('planned_at', '>', Carbon::now())
            ->with(['team1', 'team2', 'location'])
            ->get();
    }

    public function completed()
    {
        // Matches with a completed score and a planned_at in the past.
        return Result::whereNotNull('score1')
            ->whereNotNull('score2')
            ->where('planned_at', '<', Carbon::now())
            ->get();
    }

    public function additional($matchId)
    {

        $match = Result::find($matchId);
        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }

        $team1 = $match->team1;
        $team2 = $match->team2;
        $divisionId = $match->division_id;


        $position1 = TeamHelper::getTeamPositionInDivision($divisionId, $team1->id);
        $position2 = TeamHelper::getTeamPositionInDivision($divisionId, $team2->id);

        if (!$team1 || !$team2) {
            return response()->json(['message' => 'Teams not found for this match'], 404);
        }

        $availabilities = $match->availabilities()->get();

        $team1AvailableCount = $team1->players()->get()->filter(function ($player) use ($availabilities, $matchId) {
            $availability = $availabilities->first(function ($availability) use ($player, $matchId) {
                return $availability->user_id === $player->id && $availability->result_id == $matchId;
            });
            return $availability && $availability->available;
        })->count();

        $team2AvailableCount = $team2->players()->get()->filter(function ($player) use ($availabilities, $matchId) {
            $availability = $availabilities->first(function ($availability) use ($player, $matchId) {
                return $availability->user_id === $player->id && $availability->result_id == $matchId;
            });
            return $availability && $availability->available;
        })->count();

        return response()->json([
            'team1' => [
                'id' => $team1->id,
                'name' => $team1->name,
                'available_players' => $team1AvailableCount,
                'position' => $position1,
            ],
            'team2' => [
                'id' => $team2->id,
                'name' => $team2->name,
                'available_players' => $team2AvailableCount,
                'position' => $position2,
            ],
        ]);
    }

}