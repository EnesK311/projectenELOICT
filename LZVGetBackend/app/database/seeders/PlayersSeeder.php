<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Exception;

class PlayersSeeder extends Seeder
{
    public function run()
    {
        // Path to the CSV file
        $csvFile = database_path('seeders/data/PlayerSheet.csv');

        // Check if the CSV file exists and is readable
        if (!file_exists($csvFile) || !is_readable($csvFile)) {
            throw new Exception("Unable to find or read the CSV file: $csvFile");
        }

        // Optionally truncate the table to start fresh
        // DB::table('users')->truncate();

        $header = null;
        $data = [];

        // Read CSV rows
        if (($handle = fopen($csvFile, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, ",")) !== false) {
                // The first row is the header
                if (!$header) {
                    $header = $row;
                    continue;
                }

                // Create an associative array for each row
                $record = [
                    'id' => $row[0],
                    'team_id' => $row[1],
                    'season_id' => $row[2],
                    'number' => is_numeric($row[3]) ? (int) $row[3] : null,
                    'first_name' => $row[4],
                    'last_name' => $row[5],
                    'nickname' => $row[6] ?? null,
                    'email' => $row[7] ?? null,
                    'uid' => $row[8] ?? null,
                    'games' => is_numeric($row[9]) ? (int) $row[9] : null,
                    'avg_against' => is_numeric($row[10]) ? round($row[10], 2) : null,
                    'keeper_games' => is_numeric($row[11]) ? (int) $row[11] : null,
                    'created_at' => !empty($row[12]) ? Carbon::parse($row[12]) : Carbon::now(),
                    'updated_at' => !empty($row[13]) ? Carbon::parse($row[13]) : Carbon::now(),
                ];

                // Validate and set defaults
                if ($record['avg_against'] === null) {
                    $record['avg_against'] = 0; // Default to 0 if missing
                }

                $data[] = $record;
            }
            fclose($handle);
        }

        // Insert all records into the table
        if (!empty($data)) {
            DB::table('users')->insert($data);
        }
    }
}
