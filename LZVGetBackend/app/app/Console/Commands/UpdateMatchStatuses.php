<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Result;

class UpdateMatchStatuses extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'update:match-statuses';

    /**
     * The console command description.
     */
    protected $description = 'Update the statuses of all matches based on their result and time.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        // Fetch all matches
        $matches = Result::all();
        $updatedCount = 0;

        foreach ($matches as $match) {
            $originalStatus = $match->status;

            // 1. If there is a result, set status = 2
            if ($match->score1 == 0 && $match->score2 == 0 && $match->planned_at > $now) {
                $match->status = 0;
            }
            // 2. If the match is "live" (planned_at within the next hour), set status = 1
            else if (
                $match->planned_at
                && $now->diffInHours($match->planned_at) <= 1
            ) {
                $match->status = 1;
            }
            // 3. Otherwise, set status = 0
            else {
                $match->status = 2;
            }

            // Save only if the status has changed
            if ($match->status !== $originalStatus) {
                $match->save();
                $updatedCount++;
            }
        }

        $this->info("Match statuses updated successfully. Total matches updated: {$updatedCount}");

        return \Symfony\Component\Console\Command\Command::SUCCESS;
    }
}