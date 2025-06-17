<?php

namespace App\Helpers;

use App\Models\Result;
use App\Models\Team;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DivisionHelper
{
    public static function getDivisionTable($divisionId)
    {
        // Get all teams in the division
        $teams = Team::whereHas('results', function ($query) use ($divisionId) {
            $query->where('division_id', $divisionId);
        })->get();

        $tableData = [];

        foreach ($teams as $team) {
            $teamData = [
                'team_id' => $team->id,
                'team_name' => $team->name,
                'matches_played' => 0,
                'wins' => 0,
                'losses' => 0,
                'draws' => 0,
                'goals_for' => 0,
                'goals_against' => 0,
                'goal_difference' => 0,
                'points' => 0,
            ];

            // Get results for the team in the division
            $results = Result::where('division_id', $divisionId)
                ->where(function ($query) use ($team) {
                    $query->where('team1_id', $team->id)
                        ->orWhere('team2_id', $team->id);
                })
                ->whereNotNull('score1')
                ->whereNotNull('score2')
                ->where('planned_at', '<', now())
                ->get();

            foreach ($results as $result) {
                $teamData['matches_played']++;

                if ($result->team1_id == $team->id) {
                    $teamData['goals_for'] += $result->score1;
                    $teamData['goals_against'] += $result->score2;

                    if ($result->score1 > $result->score2) {
                        $teamData['wins']++;
                        $teamData['points'] += 3; // Assuming 3 points for a win
                    } elseif ($result->score1 < $result->score2) {
                        $teamData['losses']++;
                    } else {
                        $teamData['draws']++;
                        $teamData['points'] += 1; // Assuming 1 point for a draw
                    }
                } else {
                    $teamData['goals_for'] += $result->score2;
                    $teamData['goals_against'] += $result->score1;

                    if ($result->score2 > $result->score1) {
                        $teamData['wins']++;
                        $teamData['points'] += 3;
                    } elseif ($result->score2 < $result->score1) {
                        $teamData['losses']++;
                    } else {
                        $teamData['draws']++;
                        $teamData['points'] += 1;
                    }
                }
            }

            $teamData['goal_difference'] = $teamData['goals_for'] - $teamData['goals_against'];
            $tableData[] = $teamData;
        }

        // Sort the table data
        usort($tableData, function ($a, $b) {
            if ($a['points'] != $b['points']) {
                return $b['points'] - $a['points']; // Sort by points (descending)
            } elseif ($a['goal_difference'] != $b['goal_difference']) {
                return $b['goal_difference'] - $a['goal_difference']; // Sort by goal difference (descending)
            } elseif ($a['goals_for'] != $b['goals_for']) {
                return $b['goals_for'] - $a['goals_for']; // Sort by goals for (descending)
            } elseif ($a['goals_against'] != $b['goals_against']) {
                return $a['goals_against'] - $b['goals_against']; // Sort by goals against (ascending)
            } else {
                return 0; // Keep the same order if all criteria are equal
            }
        });

        // Add rank to each team
        foreach ($tableData as $index => $team) {
            $tableData[$index]['rank'] = $index + 1;
        }

        return $tableData;
    }
}

class TeamHelper
{
    public static function getTeamWinLossRecord($teamId, $limit = 5)
    {
        $results = Result::where(function ($query) use ($teamId) {
            $query->where('team1_id', $teamId)
                ->orWhere('team2_id', $teamId);
        })
            ->whereNotNull('score1')
            ->whereNotNull('score2')
            ->where('planned_at', '<', Carbon::now()) // Only past matches
            ->orderBy('planned_at', 'desc')
            ->take($limit)
            ->get();

        Log::info('Results fetched:', $results->toArray());

        $record = [];
        foreach ($results as $result) {
            // Ignore matches where score1 and score2 are both zero (likely unplayed)
            if ($result->score1 === 0 && $result->score2 === 0) {
                continue;
            }

            // Handle forfeits
            if ($result->forfeit) {
                $record[] = 'F'; // Indicate forfeit
                continue;
            }

            // Handle team1 and team2 scenarios
            if ($result->team1_id == $teamId) {
                if ($result->score1 > $result->score2) {
                    $record[] = 'W'; // Win
                } elseif ($result->score1 < $result->score2) {
                    $record[] = 'L'; // Loss
                } else {
                    $record[] = 'D'; // Draw
                }
            } else {
                if ($result->score2 > $result->score1) {
                    $record[] = 'W'; // Win
                } elseif ($result->score2 < $result->score1) {
                    $record[] = 'L'; // Loss
                } else {
                    $record[] = 'D'; // Draw
                }
            }
        }

        Log::info('Win/Loss record:', $record);
        return $record;
    }

    public static function getTeamPositionInDivision($divisionId, $teamId)
    {
        // Get all teams in the division
        $teams = Team::whereHas('results', function ($query) use ($divisionId) {
            $query->where('division_id', $divisionId);
        })->get();

        $tableData = [];

        foreach ($teams as $team) {
            $teamData = [
                'team_id' => $team->id,
                'matches_played' => 0,
                'wins' => 0,
                'losses' => 0,
                'draws' => 0,
                'goals_for' => 0,
                'goals_against' => 0,
                'goal_difference' => 0,
                'points' => 0,
            ];

            // Get results for the team in the division
            $results = Result::where('division_id', $divisionId)
                ->where(function ($query) use ($team) {
                    $query->where('team1_id', $team->id)
                        ->orWhere('team2_id', $team->id);
                })
                ->whereNotNull('score1')
                ->whereNotNull('score2')
                ->where('planned_at', '<', now())
                ->get();

            foreach ($results as $result) {
                $teamData['matches_played']++;

                if ($result->team1_id == $team->id) {
                    $teamData['goals_for'] += $result->score1;
                    $teamData['goals_against'] += $result->score2;

                    if ($result->score1 > $result->score2) {
                        $teamData['wins']++;
                        $teamData['points'] += 3; // 3 points for a win
                    } elseif ($result->score1 < $result->score2) {
                        $teamData['losses']++;
                    } else {
                        $teamData['draws']++;
                        $teamData['points'] += 1; // 1 point for a draw
                    }
                } else {
                    $teamData['goals_for'] += $result->score2;
                    $teamData['goals_against'] += $result->score1;

                    if ($result->score2 > $result->score1) {
                        $teamData['wins']++;
                        $teamData['points'] += 3;
                    } elseif ($result->score2 < $result->score1) {
                        $teamData['losses']++;
                    } else {
                        $teamData['draws']++;
                        $teamData['points'] += 1;
                    }
                }
            }

            $teamData['goal_difference'] = $teamData['goals_for'] - $teamData['goals_against'];
            $tableData[] = $teamData;
        }

        // Sort the table data
        usort($tableData, function ($a, $b) {
            if ($a['points'] != $b['points']) {
                return $b['points'] - $a['points']; // Sort by points
            } elseif ($a['goal_difference'] != $b['goal_difference']) {
                return $b['goal_difference'] - $a['goal_difference']; // Sort by goal difference
            } elseif ($a['goals_for'] != $b['goals_for']) {
                return $b['goals_for'] - $a['goals_for']; // Sort by goals for
            } elseif ($a['goals_against'] != $b['goals_against']) {
                return $a['goals_against'] - $b['goals_against']; // Sort by goals against
            } else {
                return 0; // Keep the same order if all criteria are equal
            }
        });

        // Find the rank of the specific team
        foreach ($tableData as $index => $teamData) {
            if ($teamData['team_id'] == $teamId) {
                return $index + 1; // Rank is 1-based
            }
        }

        // If the team is not found in the division
        return null;
    }
}