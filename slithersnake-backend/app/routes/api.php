<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// skins routes
Route::group(['prefix' => '/skins'], function() {
    Route::get('/', [GameController::class, 'getAllSkins']);
    Route::get('/{id}', [GameController::class, 'getSkin'])->whereNumber('id');
    Route::get('/featured', [GameController::class, 'getFeaturedSkins']);
});

// gamemodes routes
Route::group(['prefix' => '/gamemodes'], function() {
    Route::get('/', [GameController::class, 'getGamemodes']);
    Route::get('/{id}', [GameController::class, 'getGamemode'])->whereNumber('id');
});

// maps routes
Route::group(['prefix' => '/maps'], function() {
    Route::get('/', [GameController::class, 'getMaps']);
    Route::get('/maps/{id}', [GameController::class, 'getMap'])->whereNumber('id');
});

// user routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');

Route::get('/user', [AuthController::class, 'getUser'])->middleware('auth:sanctum');
Route::patch('/user', [AuthController::class, 'patchUser'])->middleware('auth:sanctum');
Route::delete('/user', [AuthController::class, 'deleteUser'])->middleware('auth:sanctum');

// duels routes
Route::post('/duels', [GameController::class, 'createDuels']);
Route::patch('/duels', [GameController::class, 'patchDuel']);

Route::delete('/user/duel', [AuthController::class, 'addDuelUser'])->middleware('auth:sanctum');