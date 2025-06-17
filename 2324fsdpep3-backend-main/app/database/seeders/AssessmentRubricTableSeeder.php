<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AssessmentRubric;
use Illuminate\Support\Carbon;

class AssessmentRubricTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $assessmentRubrics = [
            ['assessment_id' => 1, 'rubric_id' => 1, 'weight' => 20, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 1 - Communication
            ['assessment_id' => 1, 'rubric_id' => 2, 'weight' => 30, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 1 - Team Contribution
            ['assessment_id' => 1, 'rubric_id' => 3, 'weight' => 50, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 1 - Technical Skills
            ['assessment_id' => 2, 'rubric_id' => 1, 'weight' => 25, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 2 - Communication
            ['assessment_id' => 2, 'rubric_id' => 2, 'weight' => 35, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 2 - Team Contribution
            ['assessment_id' => 2, 'rubric_id' => 3, 'weight' => 40, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()], // Team Project 2 - Technical Skills
        ];

        foreach ($assessmentRubrics as $assessmentRubric) {
            AssessmentRubric::create($assessmentRubric);
        }
    }
}