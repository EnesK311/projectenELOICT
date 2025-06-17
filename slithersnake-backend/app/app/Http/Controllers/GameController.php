<?php

namespace App\Http\Controllers;

use App\Http\Resources\SkinResource;
use App\Http\Resources\GamemodeResource;
use App\Http\Resources\MapResource;
use App\Models\Duel;
use App\Models\User;
use App\Models\Gamemode;
use App\Models\Map;
use App\Models\Skin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class GameController extends Controller
{
    // Skins functions
    function getSkin(int $id) {
        return new SkinResource(Skin::findOrFail($id));
    }

    function getAllSkins() {
        return SkinResource::collection(Skin::all());
    }

    function getFeaturedSkins() {
        return SkinResource::collection(Skin::where('featured', 'true')->get());
    }

    // Gamemodes functions
    function getGamemode(int $id) {
        return new GamemodeResource(Gamemode::findOrFail($id));
    }

    function getGamemodes() {
        return GamemodeResource::collection(Gamemode::all());
    }

    // Maps function
    function getMap(int $id) {
        return new MapResource(Map::findOrFail($id));
    }

    function getMaps() {
        return MapResource::collection(Map::all());
    }

    // Duels function
    function addDuelUser(Request $request) {
        $validator = Validator::make($request->all(), [
            'duel_id' => 'required|numeric|exists:duels,id',
            'score' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request data'], 422);
        }

        $user = $request->user();
        $duel = Duel::find($request->input('duel_id'));

        $pivotData = [
            'score' => $request->input('score')
        ];

        $user->duels()->attach($duel->id, $pivotData);

        return response()->json(['message' => 'User has been added to duel'], 201);
    }

    function createDuels(Request $request) {
        $validator = Validator::make($request->all(), [
            'gamemodes_id' => 'required|numeric|exists:gamemodes,id',
            'maps_id' => 'required|numeric|exists:maps,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request data'], 422);
        }

        $duel = new Duel();

        $duel->start_time = Carbon::now();
        $duel->end_time = null;
        $duel->gamemodes_id = $request->input('gamemodes_id');
        $duel->maps_id = $request->input('maps_id');

        $duel->save();

        return response()->json(['message' => 'Duel has been created', 'data' => ['duel_id' => $duel->id]], 201);
    }

    function patchDuel(Request $request) {
        $validator = Validator::make($request->all(), [
            'duel_id' => 'required|numeric|exists:duels,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Invalid request data'], 422);
        }

        $duel = Duel::findOrFail($request->input('duel_id'));

        if($duel->end_time == null) {
            $duel->end_time = Carbon::now();
            $duel->save();
        } else {
            return response()->json(['message' => 'Duel has already been concluded'], 200);
        }
        

        return response()->json(['message' => 'Duel enddate has been set'], 200);
    }
}
