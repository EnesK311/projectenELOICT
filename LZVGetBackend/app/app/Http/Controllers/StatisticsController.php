<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Helpers\TeamHelper;
use Illuminate\Support\Facades\Log;

class StatisticsController extends Controller
{
    public function index(Request $request, $id = null)
    {
        // Determine which team to fetch: user's team or a specified team by ID
        $team = $id ? \App\Models\Team::find($id) : auth()->user()->team;

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        // Load the team and related data
        $teamWithAllData = $team->load([
            'players:id,team_id,first_name,last_name,number,games,goals,assists',
            'resultsAsTeam1' => function ($query) {
                $query->where('planned_at', '>', now())
                    ->orderBy('planned_at', 'asc');
            },
            'resultsAsTeam2' => function ($query) {
                $query->where('planned_at', '>', now())
                    ->orderBy('planned_at', 'asc');
            },
        ]);

        if (!$teamWithAllData) {
            return response()->json(['error' => 'Team data could not be loaded'], 500);
        }

        // Merge future home matches and away matches
        $allFutureMatches = $teamWithAllData->resultsAsTeam1->merge(
            $teamWithAllData->resultsAsTeam2
        );

        // Sort by date ascending (earliest first) and grab the first
        $nextGame = $allFutureMatches->sortBy('planned_at')->first();

        // If there's no upcoming match, return a response with null data
        if (!$nextGame) {
            return response()->json([
                'name' => $teamWithAllData->name,
                'players' => $teamWithAllData->players,
                'next_game' => null,
                'next_game_opponent' => null,
                'win_loss_record' => null,
                'position' => null,
            ]);
        }

        // Load all related details for the next game
        $nextGame->load([
            'team1:id,name',
            'team2:id,name',
            'division:id,name',
            'location:id,name,location,address',
        ]);

        // Get 5 last matches for both teams involved in the next game
        if ($nextGame->team1) {
            $nextGame->team1->last5Record = TeamHelper::getTeamWinLossRecord($nextGame->team1_id);
        }
        if ($nextGame->team2) {
            $nextGame->team2->last5Record = TeamHelper::getTeamWinLossRecord($nextGame->team2_id);
        }

        // Determine the opponent name
        $nextGameOpponentName = $nextGame->team1_id === $teamWithAllData->id
            ? $nextGame->team2->name
            : $nextGame->team1->name;

        // Grab the division from this next match
        $divisionId = $nextGame->division_id;
        if (!$divisionId) {
            return response()->json(['error' => 'Division not found for the team'], 404);
        }

        // Get the win/loss record and position
        $teamId = $teamWithAllData->id;
        $winLossRecord = TeamHelper::getTeamWinLossRecord($teamId);
        $position = TeamHelper::getTeamPositionInDivision($divisionId, $teamId);

        // Return the fully hydrated next_game and other details
        return response()->json([
            'name' => $teamWithAllData->name,
            'players' => $teamWithAllData->players,
            'next_game' => $nextGame, // Fully loaded next game details
            'next_game_opponent' => $nextGameOpponentName,
            'win_loss_record' => $winLossRecord,
            'position' => $position,
        ]);
    }
}
