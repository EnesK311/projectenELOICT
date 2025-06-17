<?php
namespace App\Listeners;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use App\Models\Team;
class CheckForManagerRole
{
    public function handle(Registered $event): void
    {
        $user = $event->user;
        if ($user instanceof User) {
            $team = Team::where('email', $user->email)->first();
            if ($team) {
                $user->role = 'potential_manager';
                $user->save();
                // Ensure the email verification notification is sent
                $user->sendEmailVerificationNotification();
            }
        }
    }
}
