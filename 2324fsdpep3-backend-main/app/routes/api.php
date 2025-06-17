<?php
use App\Http\Controllers\OpoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PeerController;
use Laravel\Sanctum\Sanctum;

//namescpace controllers
use App\Http\Controllers\HomepageTextController;
use App\Http\Controllers\AssessmentController;
use App\Http\Controllers\RubricController;
use App\Http\Controllers\StudentGroupController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AssessmentRubricController;

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

//NEED TE GET RID OF UNUSED ROUTES

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//test
//Route::get('/test', [AuthController::class, 'test']);


//main page content everyone needs to pull to get on landing page
Route::get('/homepage-texts', [HomepageTextController::class, 'index']);
// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

//password reset logic
Route::post('/password/reset', [AuthController::class, 'resetPassword'])->name('password.reset');
//laravel created email
//Route::post('/password/email', [AuthController::class, 'sendResetLinkEmail']);
//email created by me
Route::post('/password/email', [AuthController::class, 'handleSendPasswordResetLink']);


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/students', [AuthController::class, 'student']);

    //create teacher as admin
    Route::post('/teachers', [AuthController::class, 'createTeacher']);

    //route to adjust main page content 
    Route::put('/homepage-texts/{id}', [HomepageTextController::class, 'update']);

    Route::get('/assessments', [AssessmentController::class, 'index']);

    Route::post('/assessments', [AssessmentController::class, 'store']);
    Route::get('/assessments/{id}', [AssessmentController::class, 'show']);
    Route::put('/assessments/{id}', [AssessmentController::class, 'update']);
    Route::delete('/assessments/{id}', [AssessmentController::class, 'destroy']);

    //exportAssessments
    Route::get('/assessments/{id}/csv', [AssessmentController::class, 'exportAssessment']);

    Route::get('/assessments/{id}/calculated', [AssessmentController::class, 'CalculateResults']);
    //get assessment info for teachers
    Route::get('/assessments/{id}', [AssessmentController::class, 'teacher']);
    //get assessment info for student
    Route::get('/assessments/{id}', [AssessmentController::class, 'student']);

    Route::get('/rubrics', [RubricController::class, 'index']);
    Route::post('/rubrics', [RubricController::class, 'store']);
    Route::get('/rubrics/{id}', [RubricController::class, 'show']);
    Route::put('/rubrics/{id}', [RubricController::class, 'update']);
    Route::delete('/rubrics/{id}', [RubricController::class, 'destroy']);

    //assessments / id / rubrics beter
    Route::post('/assessment-rubrics', [AssessmentRubricController::class, 'store']);
    Route::put('/assessment-rubrics/{id}', [AssessmentRubricController::class, 'update']);

    Route::get('/student-groups', [StudentGroupController::class, 'index']);
    Route::post('/student-groups', [StudentGroupController::class, 'store']);
    Route::get('/student-groups/{id}', [StudentGroupController::class, 'show']);
    Route::put('/student-groups/{id}', [StudentGroupController::class, 'update']);
    Route::delete('/student-groups/{id}', [StudentGroupController::class, 'destroy']);

    //get and post opo
    Route::get('/opos', [OpoController::class, 'index']);

    Route::post('/opos', [OpoController::class, 'storename']); //first create the opo
    Route::post('/opos/file', [OpoController::class, 'storestudents']); //get excel file and created opo number

    //get students and groups associated to an opo
    Route::get('/opo/{id}', [OpoController::class, 'show']);

    //call to create scores at end of assessment creation
    Route::post('/scores', [ScoreController::class, 'createAllScores']);
    //ask all scores where user received something to generate analytics
    Route::get('/scores/{id}', [ScoreController::class, 'getScoresForAnalytics']);

    //sending scores a student filled in
    Route::post('/assessments/{assessment}/submit-scores', [ScoreController::class, 'submitScores']);

    //getscores for teeachers
    Route::get('/scores/assessments/{id}', [ScoreController::class, 'getScoresForTeachers']);

    Route::get('/assessments/scores/{id}', [ScoreController::class, 'getScoresForStudents']);

    // ? No idea what i was doing here

    //associate a student with an opo
    //ask if this link is ok
    Route::post('/associate/{opoId}/{studentId}', [OpoController::class, 'associate']);
    //delete a student from an opo
    //Route::delete('/associate/{opoId}/{studentId}', [OpoController::class, 'deleteAssociate']);


    //Route::post('/scores', [ScoreController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
});