<?php

namespace App\Http\Controllers;

use App\Mail\AccountCreatedMail;
use App\Mail\CustomResetPasswordMail;
use App\Models\Opo;
use App\Models\User;
use App\Models\Group;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Illuminate\Support\Facades\Mail;
use App\Mail\GroupAddedMail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;


class OpoController extends Controller
{
    public function index()
    {
        return Opo::all();
    }

    //to activate passwordreset when user is created
    protected function sendPasswordResetLink($user)
    {
        $token = Password::createToken($user);

        // Send a custom email with a link pointing to your frontend
        Mail::to($user->email)->send(new CustomResetPasswordMail($user, $token));
    }

    //receive name and excel file
    public function storename(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        //check if opo with same name exists
        if (Opo::where('name', $request->name)->exists()) {
            return response()->json(['error' => 'OPO with this name already exists.'], 409);
        }
        $opo = Opo::create($request->all());

        return response()->json($opo, 201);
    }

    public function storestudents(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
            'opo_id' => 'required|integer|exists:opos,id',
        ]);

        // Check if a file is uploaded
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        // Validate the file extension
        $file = $request->file('file');
        if (!in_array($file->getClientOriginalExtension(), ['xlsx', 'xls', 'csv'])) {
            return response()->json(['error' => 'Invalid file type. Please upload an Excel file.'], 400);
        }

        try {
            $opo = Opo::findOrFail($request->opo_id);

            $spreadsheet = (new Xlsx())->load($file->getRealPath());
            $rows = $spreadsheet->getActiveSheet()->toArray();

            // Remove the header row
            array_shift($rows);

            foreach ($rows as $row) {
                $email = $row[2];
                $groupTitle = $row[3];

                if (!Str::endsWith($email, '@student.odisee.be')) {
                    Log::warning('Skipping invalid or non-odisee email:', ['email' => $email]);
                    continue;
                }

                // Find or create the user
                $user = User::firstOrCreate(
                    ['email' => $email],
                    ['firstname' => $row[0], 'lastname' => $row[1], 'email' => $email]
                );

                // Attach the user to the OPO
                $opo->users()->syncWithoutDetaching($user->id);

                if (!empty($groupTitle)) {
                    $group = $opo->groups()->firstOrCreate(['title' => $groupTitle]);
                    $group->users()->syncWithoutDetaching($user->id);
                }

                if ($user->wasRecentlyCreated) {
                    $this->sendAccountCreationEmail($user, $opo, $group ?? null);
                } else {
                    $this->sendGroupAdditionEmail($user, $opo, $group ?? null);
                }
            }

            return response()->json(['message' => 'Students stored successfully'], 201);
        } catch (\Exception $e) {
            \Log::error('File upload error: ' . $e->getMessage(), [
                'file_path' => $file->getRealPath(),
                'file_name' => $file->getClientOriginalName(),
                'file_extension' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['error' => 'Failed to process the file: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Send the account creation email to a newly created user.
     */
    private function sendAccountCreationEmail(User $user, Opo $opo, ?Group $group)
    {
        $token = Password::createToken($user);
        $resetUrl = config('app.url') . "/password/reset?token=" . $token . "&email=" . urlencode($user->email);

        Mail::to($user->email)->send(new AccountCreatedMail($user, $resetUrl, $opo, $group));
    }

    /**
     * Send the group addition email to an existing user.
     */
    private function sendGroupAdditionEmail(User $user, Opo $opo, ?Group $group)
    {
        Mail::to($user->email)->send(new GroupAddedMail($user, $opo, $group));
    }

    //get all groups in this opo and all students associated
    public function show($id)
    {
        // Eager load the groups and their associated users
        $opo = Opo::with('groups.users')->findOrFail($id);

        // Get all user IDs that are already in any group of this OPO
        $userIdsInGroups = $opo->groups->flatMap(function ($group) {
            return $group->users->pluck('id');
        })->unique();

        // Get all users associated with this OPO
        $allUsers = $opo->users;

        // Filter out users who are already in any group
        $usersNotInGroups = $allUsers->whereNotIn('id', $userIdsInGroups->all());

        return response()->json([
            'groups' => $opo->groups,
            'users' => $usersNotInGroups->values(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $opo = Opo::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $opo->update($request->all());

        return response()->json($opo, 200);
    }

    public function destroy($id)
    {
        Opo::findOrFail($id)->delete();

        return response()->json(null, 204);
    }

    //message"SQLSTATE[42S02]: Base table or view not found: 1146 Table 'laravel-project.user_opos' doesn't exist (Connection: mysql, SQL: insert into `user_opos` (`opo_id`, `user_id`) values (4, 3))"

    public function associate($opoId, $studentId)
    {
        $opo = Opo::findOrFail($opoId);
        $student = User::findOrFail($studentId);

        if (!$opo->users()->where('user_id', $studentId)->exists()) {
            $opo->users()->attach($studentId);
        } else {
            return response()->json(['message' => 'User already associated with this OPO.'], 409);
        }
    }
}