<?php
namespace App\Listeners;
use Illuminate\Auth\Events\Verified;
use App\Models\User;
class AssignManagerRole
{
    public function handle(Verified $event): void
    {
        $user = $event->user;
        if ($user instanceof User && $user->role === 'potential_manager') {
            $user->role = 'manager';
            $user->save();
        }
    }
}
