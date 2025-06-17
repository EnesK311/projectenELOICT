<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PlayerController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function myplayers()
    {
        return User::where('team_id', auth()->user()->team_id)->get();
    }

    public function byTeam($team_id)
    {
        return User::where('team_id', $team_id)->get();
    }

    public function search(Request $request)
    {
        $name = $request->query('name');
        if (!$name) {
            return response()->json(['error' => 'Name parameter required'], 400);
        }

        // Search in first_name or last_name
        return User::where('first_name', 'LIKE', "%{$name}%")
            ->orWhere('last_name', 'LIKE', "%{$name}%")
            ->get();
    }

    public function linkEmail(Request $request, $id)
    {

        Log::info('Request to update email for user ' . $id);
        // Validate the request
        $request->validate([
            'email' => 'required|email|unique:users,email', // Ensure the email is unique and valid
        ]);

        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the authenticated user has permission to update this user's email
        if ($user->team_id !== auth()->user()->team_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Update the email
        $user->email = $request->email;
        $user->save();

        return response()->json(['message' => 'Email updated successfully', 'user' => $user]);
    }
}
