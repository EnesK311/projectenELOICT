<?php

namespace App\Http\Controllers;

use App\Models\LiveScore;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use App\Events\ScoreUpdated;



class LiveScoreController extends Controller
{
    public function index()
    {
        $liveScores = LiveScore::all();
        return response()->json(['liveScores' => $liveScores]);
    }

    //requesting rights to manage live score
    public function requestLiveScores(Request $request, $matchId)
    {
        Log::info('Request to manage scores for match ' . $matchId);

        // 1. Validate the request
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request data.', 'errors' => $validator->errors()], 400);
        }

        // Check if the match is already in the table:
        $liveScore = LiveScore::where('result_id', $matchId)->first();
        if ($liveScore) {
            //check if the user id is this users id
            if ($liveScore->user_id === Auth::user()->id) {
                return response()->json(['message' => 'You already have permission to manage scores for this match.'], 200);
            } else {
                return response()->json(['message' => 'Match already exists.'], 400);
            }
        }

        // 2. Get the authenticated user
        $user = Auth::user();

        Log::info('before find match');
        // 3. Find the match
        $match = Result::findOrFail($matchId);
        Log::info('after find match');

        // 4. Check if the user is near the match location
        $isNear = $this->isUserNearLocation(
            $request->latitude,
            $request->longitude,
            $match->location->lat,
            $match->location->lng,
            $threshold = 1
        );

        if (!$isNear) {
            return response()->json(['message' => 'You are not near the match location.'], 403);
        }

        // 5. Create a new live score entry with result_id
        Log::info($match->id);
        Log::info($user->id);
        Log::info($match);
        $liveScore = new LiveScore([
            'user_id' => $user->id,
            'result_id' => $match->id,
            'home_team_score' => 0,
            'away_team_score' => 0,
        ]);

        $liveScore->save();

        // 6. Return success response
        return response()->json(['message' => 'Permission to manage scores granted.']);
    }

    public function updateScore(Request $request, $matchId)
    {
        // Validate the request
        $request->validate([
            'home_team_score' => 'required|integer',
            'away_team_score' => 'required|integer',
        ]);

        $liveScore = LiveScore::where('result_id', $matchId)->firstOrFail();

        $liveScore->update([
            'home_team_score' => $request->home_team_score,
            'away_team_score' => $request->away_team_score,
        ]);

        try {
            broadcast(new ScoreUpdated(
                $matchId,
                $request->home_team_score,
                $request->away_team_score
            ))->toOthers();
        } catch (\Exception $e) {
            Log::error('Broadcasting failed:', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Broadcasting failed.'], 500);
        }

        Log::info('Returning successful response:', [
            'home_team_score' => $liveScore->home_team_score,
            'away_team_score' => $liveScore->away_team_score,
        ]);

        return response()->json([
            'message' => 'Score updated and broadcasted successfully.',
            'home_team_score' => $liveScore->home_team_score,
            'away_team_score' => $liveScore->away_team_score,
        ]);
    }
    private function isUserNearLocation($userLat, $userLng, $matchLat, $matchLng, $threshold = 1)
    {
        // Convert latitude and longitude from degrees to radians
        $lat1 = deg2rad($userLat);
        $lon1 = deg2rad($userLng);
        $lat2 = deg2rad($matchLat);
        $lon2 = deg2rad($matchLng);

        // Haversine formula
        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;
        $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        // Radius of the Earth in kilometers
        $radius = 6371;

        // Calculate the distance
        $distance = $radius * $c;

        // Check if the distance is within the threshold
        return $distance <= $threshold;
    }

    public function islive($matchId)
    {
        $match = LiveScore::findOrFail($matchId);


        return response()->json(['message' => 'Match is live.'], 200);
    }
}