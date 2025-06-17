<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\Match;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

use App\Models\Result;

class AvailabilityController extends Controller
{
    public function getTeamAvailabilities($matchId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not logged in'], 404);
        }

        $match = Result::find($matchId);
        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }

        $team = $user->team;

        if (!$team) {
            return response()->json(['message' => 'Team not found'], 404);
        }

        if ($team->id !== $match->team1_id && $team->id !== $match->team2_id) {
            return response()->json(['message' => 'Team not found in this match'], 404);
        }

        $players = $team->players()->get();
        $availabilities = $match->availabilities()->get();

        //Log::info($availabilities);

        $playerAvailabilities = $players->map(function ($player) use ($availabilities, $matchId) {
            $availability = $availabilities->first(function ($availability) use ($player, $matchId) {
                return $availability->user_id === $player->id && $availability->result_id == $matchId; // Fixed
            });

            return [
                'player_name' => $player->name,
                'availability' => $availability ? ($availability->available ? 'true' : 'false') : 'not filled in',
            ];
        });

        return response()->json($playerAvailabilities);
    }

    public function latest()
    {
        // Retrieve authenticated user
        $user = auth()->user();
        $team = $user->team;

        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Load the user's team and related data
        // Only fetch future matches (planned_at > now()) in both relationships

        // If no team found
        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        //get soonest game where team is team1 or team2
        $nextGame = Result::where(function ($query) use ($team) {
            $query->where('team1_id', $team->id)
                ->orWhere('team2_id', $team->id);
        })
            ->where('planned_at', '>', now()) // Fetch only future matches
            ->orderBy('planned_at', 'asc')   // Order by the nearest upcoming match
            ->first();

        return response()->json([
            'data' => $nextGame,
        ]);

    }


    public function updateAvailability(Request $request, $matchId)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['message' => 'User not logged in'], 404);
        }

        $validator = Validator::make($request->all(), [
            'available' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $match = Result::find($matchId);


        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }

        $availability = Availability::firstOrNew([
            'user_id' => $user->id,
            'result_id' => $matchId,
        ]);

        $availability->available = $request->input('available');
        $availability->save();

        return response()->json(['message' => 'Availability updated successfully', 'availability' => $availability], 200);
    }

}
