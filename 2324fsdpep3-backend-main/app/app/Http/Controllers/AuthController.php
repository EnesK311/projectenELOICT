<?php
namespace App\Http\Controllers;

use App\Mail\TeacherCreatedMail;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Mail\CustomResetPasswordMail;

class AuthController extends Controller
{
    public function login(Request $request): Response
    {
        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return response(['message' => 'The user has been authenticated successfully'], 200);
        }
        return response(['message' => 'The provided credentials do not match our records.'], 401);
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        return response(['message' => 'The user has been logged out successfully'], 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        $user = new User();
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));

        $user->save();

        return response()->json(['message' => 'User has been created'], 201);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => ['required', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully'], 200);
        }

        return response()->json(['error' => 'Invalid token or email'], 400);
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json(['message' => __($status)], 200);
        }
        return response()->json(['message' => __($status)], 400);
    }

    protected function sendCustomPasswordResetLink($user)
    {
        $token = Password::createToken($user);
        $resetUrl = config('app.url') . "/password/reset?token=" . $token . "&email=" . urlencode($user->email);

        // Send a custom email with a link pointing to your frontend
        Mail::to($user->email)->send(new CustomResetPasswordMail($user, $resetUrl));
    }

    //for teachers
    protected function sendCreatedEmailLink($user)
    {
        $token = Password::createToken($user);
        $resetUrl = config('app.url') . "/password/reset?token=" . $token . "&email=" . urlencode($user->email);

        // Send a custom email with a link pointing to your frontend
        Mail::to($user->email)->send(new TeacherCreatedMail($user, $resetUrl));
    }

    public function handleSendPasswordResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'We can\'t find a user with that email address.'], 404);
        }

        $this->sendCustomPasswordResetLink($user);

        return response()->json(['message' => 'A password reset link has been sent.'], 200);
    }

    public function test(Request $request)
    {
        return response()->json(['message' => 'API is working'], 200);
    }

    public function user(Request $request)
    {
        return response()->json(['data' => Auth::user()], 200);
    }

    public function student(Request $request)
    {
        $students = User::where('role', 'student')->get();
        return response()->json(['data' => $students], 200);
    }

    //create teacher function
    public function createTeacher(Request $request)
    {
        //check if request was made by an admin?
        if (Auth::user()->role != 'admin') {
            return response()->json(['message' => 'You are not authorized to create a teacher'], 401);
        }
        //use guard

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'email' => 'required|string|email|unique:users',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 422);
        }

        $user = new User();
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->role = 'teacher';

        //send resetpasswordmail to teacher before saving user so account doesn't get created without reset 
        $this->sendCreatedEmailLink($user);

        $user->save();

        return response()->json(['message' => 'Teacher has been created'], 201);
    }
}