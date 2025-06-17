<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Exception;

class ResultsSeeder extends Seeder
{
    public function run()
    {
        $filePath = database_path('/seeders/data/ResultsSheet.csv');
        $handle = fopen($filePath, 'r');

        if ($handle === false) {
            throw new Exception("Cannot open the CSV file at $filePath");
        }

        // Read the header row to get column names
        $header = fgetcsv($handle, 0, ","); // Adjust the delimiter based on your CSV file
        if (!$header) {
            throw new Exception("CSV file is empty or has no header row.");
        }

        $batchSize = 500;
        $batch = [];

        while (($row = fgetcsv($handle, 0, ",")) !== false) { // Adjust the delimiter
            // Skip rows that don't match the header column count
            if (count($row) < count($header)) {
                continue; // Log or handle these cases as needed
            }

            $data = [
                'id' => isset($row[0]) ? $row[0] : null,
                'status' => isset($row[1]) ? $row[1] : null,
                'notification' => isset($row[2]) ? $row[2] : null,
                'division_id' => isset($row[3]) ? $row[3] : null,
                'sportshall_id' => isset($row[4]) ? $row[4] : null, // Adjusted field
                'planned_at' => isset($row[5]) && $row[5] !== '' ? $row[5] : null,
                'planned_orig_at' => isset($row[6]) && $row[6] !== '' ? $row[6] : null,
                'season_id' => isset($row[7]) ? $row[7] : null,
                'delayed_request' => isset($row[8]) ? $row[8] : null,
                'delayed_status' => isset($row[9]) ? $row[9] : null,
                'delayed_prop_at' => isset($row[10]) && $row[10] !== '' ? $row[10] : null,
                'delayed_prop_count' => isset($row[11]) ? $row[11] : null,
                'team1_id' => isset($row[12]) ? $row[12] : null,
                'team2_id' => isset($row[13]) ? $row[13] : null,
                'score1' => isset($row[14]) ? $row[14] : 0,
                'score2' => isset($row[15]) ? $row[15] : 0,
                'score3' => isset($row[16]) ? $row[16] : null,
                'score4' => isset($row[17]) ? $row[17] : null,
                'forfeit' => isset($row[18]) ? $row[18] : null,
                'forfeit_at' => isset($row[19]) && $row[19] !== '' ? $row[19] : null,
                'created_at' => isset($row[20]) && $row[20] !== '' ? $row[20] : now(),
                'updated_at' => isset($row[21]) && $row[21] !== '' ? $row[21] : now(),
            ];

            // Skip rows with invalid IDs
            if ($data['id'] === null) {
                continue;
            }

            $batch[] = $data;

            if (count($batch) >= $batchSize) {
                DB::table('results')->insert($batch);
                $batch = [];
            }
        }

        // Insert any remaining rows
        if (count($batch) > 0) {
            DB::table('results')->insert($batch);
        }

        fclose($handle);
    }
}