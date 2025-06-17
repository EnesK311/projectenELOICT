<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Assessment;

class AssessmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Assessment::create([
            'title' => 'Team Project 1',
            'description' => 'Evaluate team project performance.',
            'created_by' => 2, // Assuming user ID 2 is a teacher
            'opo_id' => 1, // Software Engineering
            'end_date' => '2024-12-31',
            'is_result_visible' => true
        ]);

        Assessment::create([
            'title' => 'Team Project 2',
            'description' => 'Evaluate second team project performance.',
            'created_by' => 2,
            'opo_id' => 2, // Database Systems
            'end_date' => '2025-01-15',
            'is_result_visible' => false
        ]);
    }
}