<?php

namespace App\Console;

use App\Models\Assessment;
use App\Mail\AssessmentReminderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            // Get all assessments where `is_results_visible` is 0
            $assessments = Assessment::with('createdBy', 'opo')->where('is_result_visible', 0)->get();

            foreach ($assessments as $assessment) {
                $endDate = Carbon::parse($assessment->end_date);
                $notificationDays = $assessment->notification_days;

                // Calculate the notification date (end date minus notification days)
                $notificationDate = $endDate->subDays($notificationDays);

                if (Carbon::now()->isSameDay($notificationDate)) {
                    // Get all users in the assessment's groups
                    $users = $assessment->groups->flatMap(function ($group) {
                        return $group->users;
                    });

                    // Send email to each user
                    foreach ($users as $user) {
                        try {
                            Mail::to($user->email)->send(new AssessmentReminderMail($user, $assessment));
                        } catch (\Exception $e) {
                            Log::error('Error sending email to ' . $user->email . ': ' . $e->getMessage());
                        }
                    }
                }
            }
        })->dailyAt('13:00'); // Adjust the time as needed
    }

    //a function where we check to see if all assessments where result_is_visible is 0 if the due date is today set it to 1
    protected function checkAssessments(Schedule $schedule)
    {
        $schedule->call(function () {
            // Get all assessments where `is_results_visible` is 0
            $assessments = Assessment::with('createdBy', 'opo')->where('is_result_visible', 0)->get();

            foreach ($assessments as $assessment) {
                $endDate = Carbon::parse($assessment->end_date);

                //set results_visbile to 1
                $assessment->is_result_visible = 1;
                $assessment->save();

                if (Carbon::now()->isSameDay($endDate)) {
                    // Get all users in the assessment's groups
                    $users = $assessment->groups->flatMap(function ($group) {
                        return $group->users;
                    });

                    // Send email to each user
                    foreach ($users as $user) {
                        try {
                            //make an assessment ended email
                            Mail::to($user->email)->send(new AssessmentEndedMail($user, $assessment));
                        } catch (\Exception $e) {
                            Log::error('Error sending email to ' . $user->email . ': ' . $e->getMessage());
                        }
                    }
                }
            }
        })->dailyAt('13:00'); // Adjust the time as needed
    }


    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}