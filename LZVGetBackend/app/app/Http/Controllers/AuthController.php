<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use App\Notifications\CustomVerifyEmail;
use App\Notifications\VerifyEmailCustom;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        //Validation
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        //look of the register is a manager
        $team = Team::where('email', $request->email)
            ->where('first_name', "{$request->first_name}")
            ->where('last_name', $request->last_name)
            ->first();

        if ($team) {
            $user = User::where('team_id', $team->id)
                ->where('first_name', $request->first_name)
                ->where('last_name', $request->last_name)
                ->first();

            if ($user) {
                // Update existing user to manager
                $user->update([
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'manager',
                ]);

            }
            //we need to look if there is a player who has this email and is not registered yet
            else if ($user = User::where('email', $request->email)->where('team_id', $team->id)->first()) {
                $user->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'password' => Hash::make($request->password),
                    'role' => 'player',
                ]);
            } else {
                // Create a new user with manager role
                $user = User::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'manager',
                    'team_id' => $team->id,
                ]);
            }

            // Send email verification
            return $this->sendEmailVerificationResponse($user, 'Manager role assigned. Please verify your email.');
        } else {
            //if not a manager look if the email is already linked to a user
            $existingUser = User::where('email', $request->email)->first();

            if ($existingUser->hasVerifiedEmail()) {
                return response()->json([
                    'message' => 'User with this email already exists.',
                    'user' => $existingUser,
                ], 400);
            } else if (!$existingUser->hasVerifiedEmail()) {
                $existingUser->update([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'password' => Hash::make($request->password),
                    'role' => 'player',
                ]);
                return $this->sendEmailVerificationResponse($existingUser, 'Player role assigned. Please verify your email.');
            } else {
                // Create a new user with viewer role
                $user = User::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'role' => 'viewer',
                ]);

                if (!$user) {
                    return response()->json(['message' => 'Registration failed.'], 500);
                }

                // Send email verification
                return $this->sendEmailVerificationResponse($user, 'Viewer role assigned. Please verify your email.');
            }
        }
    }

    protected function sendEmailVerificationResponse(User $user, string $message)
    {
        $plainToken = $user->generateEmailVerificationToken();
        $verificationUrl = URL::temporarySignedRoute(
            'custom.verification.verify',
            now()->addMinutes(60), // link is 60 min geldig
            [
                'email' => $user->email,
                'token' => $plainToken,
            ]
        );

        $user->sendEmailVerification($verificationUrl);

        Log::info('Verification URL: ' . $verificationUrl);


        return response()->json([
            'message' => 'Registration successful. Please verify your email.',
            'user' => $user,
        ], 200);
    }
    public function verifyEmail(Request $request)
    {
        Log::info('inside verifyEmail in AuthController');
        Log::info('Request URL: ' . $request->fullUrl());

        if (!URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid verification URL.'], 400);
        }

        $user = User::where('email', $request->input('email'))->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        if ($user->email_verification_expires_at < now()) {
            return response()->json(['message' => 'Verification token expired.'], 400);
        }

        if (!Hash::check($request->input('token'), $user->email_verification_token)) {
            return response()->json(['message' => 'Invalid verification token.'], 400);
        }

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        $user->email_verification_token = null;
        $user->email_verification_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Email verified successfully!']);
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $player = User::where('email', $request->email)->first();

        if (!$player || !Hash::check($request->password, $player->password)) {
            return response()->json([
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if (!$player->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email before logging in.',
            ], 403);
        }

        $userData = [
            'id' => $player->id,
            'first_name' => $player->first_name,
            'last_name' => $player->last_name,
            'email' => $player->email,
            'role' => $player->role,
            'goals' => $player->goals,
            'assists' => $player->assists,
            'games' => $player->games,
        ];

        $token = $player->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'player' => $userData,
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
