<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Result;
use App\Models\User;

class FixPastMatches extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Example usage: php artisan fix:past-matches
     */
    protected $signature = 'fix:past-matches';

    /**
     * The console command description.
     */
    protected $description = 'Assign random scores for past matches that do not yet have a result and assign goals/assists to players.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Query all matches that are in the past but are not yet finalized (status != 2)
        // Adjust the condition to match however you track "future" vs "past"
        // (e.g. planned_at < now() and status != 2).
        $pastMatches = Result::where('planned_at', '<', Carbon::now())
            ->where('status', '!=', 2) // or ->whereNotIn('status', [2]) if you have multiple statuses
            ->get();

        $this->info("Found {$pastMatches->count()} matches in the past without a final result.");

        foreach ($pastMatches as $match) {
            // Generate random scores between 0 and 10, for example
            $score1 = rand(0, 10);
            $score2 = rand(0, 10);

            // Update the match
            $match->score1 = $score1;
            $match->score2 = $score2;
            $match->status = 2; // "has a result"
            $match->save();

            // Distribute goals & assists randomly among players of each team
            $this->distributeGoalsAndAssists($match->team1_id, $score1);
            $this->distributeGoalsAndAssists($match->team2_id, $score2);

            $this->info("Match #{$match->id}: updated scores to {$score1} - {$score2}");
        }

        $this->info('Done!');
        return \Symfony\Component\Console\Command\Command::SUCCESS;
    }

    /**
     * Distribute a given number of goals (and assists) randomly to players in a specific team.
     */
    private function distributeGoalsAndAssists(?int $teamId, int $goals)
    {
        if (!$teamId) {
            return;
        }

        // Retrieve players for the given team.
        // If you only want "active" players, or those with role = 'player', add a where condition:
        // ->where('role', 'player')
        $players = User::where('team_id', $teamId)->get();

        // Safety check
        if ($players->isEmpty()) {
            return;
        }

        // For each goal, pick a random player for the goal, and also pick a random (possibly different) player for the assist
        for ($i = 0; $i < $goals; $i++) {
            // Randomly pick a player to assign a goal
            $goalScorer = $players->random();
            $goalScorer->increment('goals', 1);

            // Randomly pick a player to assign an assist
            // If you do NOT want a player to assist their own goal, you can do something like:
            // $assistGiver = $players->where('id', '!=', $goalScorer->id)->random();
            // But for simplicity, we’ll allow a player to assist themselves.
            $assistGiver = $players->random();
            $assistGiver->increment('assists', 1);
        }
    }
}
