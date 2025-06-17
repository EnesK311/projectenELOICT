<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\DivisionController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\ResultController;
use App\Http\Controllers\Api\PlayerController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
  Implement this to see if user is logged in, and if not, return 401
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
*/

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Endpoint for verifying the email
Route::get('/email/verify/custom', [AuthController::class, 'verifyEmail'])->name('custom.verification.verify');




// Protected routes, requiring authentication
Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/check-login', function (Request $request) {
        return response()->json(['message' => 'User is logged in'], 200);
    });


    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Email verification status

    Route::get('/email/verify-status', function (Request $request) {
        return response()->json([
            'verified' => $request->user()->hasVerifiedEmail(),
        ]);
    });

    // Send email verification notification
    Route::post('/email/verify/resend', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email sent.']);
    })->name('verification.resend');


    // Match related routes
    Route::group(['prefix' => 'matches'], function () {
        Route::get('/', [LiveScoreController::class, 'index']);
        //route to check users location, see if he's allowed to keep score of a live match
        //livescorepermission/MATCHID/REQUEST/ USER AND LOCATION OF USER INSIDE REQUEST
        //push change to live score
        Route::post('/{matchId}/request-live-scores', [LiveScoreController::class, 'requestLiveScores']);

        Route::get('/islive/{matchId}', [LiveScoreController::class, 'islive']);
        Route::post('/{matchId}/update-score', [LiveScoreController::class, 'updateScore']);
        // Pictures for match
        Route::get('/{matchId}/images', [PictureController::class, 'index']);
        Route::post('/{matchId}/upload-image', [PictureController::class, 'upload']);

        Route::get('/latest', [AvailabilityController::class, 'latest']);

        Route::get('/{matchId}/availabilities', [AvailabilityController::class, 'getTeamAvailabilities']);
        Route::post('/{matchId}/availabilities', [AvailabilityController::class, 'updateAvailability']);
    });

    // Player routes
    Route::get('/myplayers', [PlayerController::class, 'myplayers']);
    Route::group(['prefix' => 'players'], function () {
        //get players in your team and their details

        //link email of player with player in your team
        Route::post('/{id}/link-email', [PlayerController::class, 'linkEmail']);

    });

    // Statistics for the authenticated user
    Route::get('/statistics', [StatisticsController::class, 'index']);

    //showing latest 3 matches of a division
    Route::get('results/recent', [ResultController::class, 'recent']);

    //showing latest 3 matches of a division
    Route::get('results/recent/{id}', [ResultController::class, 'recentmatchesdivision']);


});

Route::get('/statistics/{id}', [StatisticsController::class, 'index']);

Route::get('/division/name/{id}', [DivisionController::class, 'getDivisionName']);

//fetch aditional data result
Route::get('/results/{id}/additional', [ResultController::class, 'additional']);


// Public API Routes (No authentication required)

// Regions Routes
Route::group(['prefix' => 'regions'], function () {
    Route::get('/', [RegionController::class, 'index']);
    Route::get('{id}', [RegionController::class, 'show']);
    Route::get('{id}/divisions', [RegionController::class, 'divisions']);
});

// Divisions Routes
Route::group(['prefix' => 'divisions'], function () {
    Route::get('/', [DivisionController::class, 'index']);
    Route::get('{id}', [DivisionController::class, 'show']);
    Route::get('{id}/results', [DivisionController::class, 'results']);
    Route::get('/{division_id}/table', [DivisionController::class, 'getTable']);
});

// Teams Routes
Route::group(['prefix' => 'teams'], function () {
    Route::get('/', [TeamController::class, 'index']);
    Route::get('{id}', [TeamController::class, 'show']);
    Route::get('{id}/players', [TeamController::class, 'players']);
    Route::get('{id}/results', [TeamController::class, 'results']);
    Route::get('search', [TeamController::class, 'search']); // example: /api/teams/search?name=...
});


// Players Routes
Route::group(['prefix' => 'players'], function () {
    Route::get('/', [PlayerController::class, 'index']);
    Route::get('{id}', [PlayerController::class, 'show']);
    Route::get('team/{team_id}', [PlayerController::class, 'byTeam']);
    Route::get('search', [PlayerController::class, 'search']); // example: /api/players/search?name=...
});

// Locations Routes
Route::group(['prefix' => 'locations'], function () {
    Route::get('/', [LocationController::class, 'index']);
    Route::get('{id}', [LocationController::class, 'show']);
    Route::get('{id}/results', [LocationController::class, 'results']);
});


// Results Routes
Route::group(['prefix' => 'results'], function () {
    Route::get('/', [ResultController::class, 'index']);
    Route::get('{id}', [ResultController::class, 'show']);
    Route::get('division/{division_id}', [ResultController::class, 'byDivision']);

    Route::get('team/{team_id}', [ResultController::class, 'byTeam']);
    Route::get('location/{location_id}', [ResultController::class, 'byLocation']);
    Route::get('forfeit', [ResultController::class, 'forfeited']);
    Route::get('upcoming', [ResultController::class, 'upcoming']);
    Route::get('completed', [ResultController::class, 'completed']);
});