<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Score;
use App\Models\AssessmentRubric;

class ScoresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Assuming the `assessment_rubrics` table has relevant data
        $group1_rubrics = AssessmentRubric::where('assessment_id', 1)->pluck('id')->toArray(); // Rubrics for Team Project 1
        $group2_rubrics = AssessmentRubric::where('assessment_id', 2)->pluck('id')->toArray(); // Rubrics for Team Project 2

        // Group 1 scores for Team Project 1
        $group1_members = [1, 2, 3, 4, 5];
        foreach ($group1_members as $member) {
            foreach ($group1_rubrics as $assessment_rubric) {
                Score::create([
                    'assessment_id' => 1,
                    'group_id' => 1,
                    'user_id' => $member,
                    'assessment_rubric_id' => $assessment_rubric,
                    'given_by' => $member,
                    'score' => rand(10, 25)
                ]);

                // Randomly skip some scores to simulate incomplete assessments
                if (rand(0, 1)) {
                    foreach (array_diff($group1_members, [$member]) as $other_member) {
                        Score::create([
                            'assessment_id' => 1,
                            'group_id' => 1,
                            'user_id' => $other_member,
                            'assessment_rubric_id' => $assessment_rubric,
                            'given_by' => $member,
                            'score' => rand(10, 25)
                        ]);
                    }
                }
            }
        }

        // Group 2 scores for Team Project 2
        $group2_members = [6, 7, 8, 9, 10];
        foreach ($group2_members as $member) {
            foreach ($group2_rubrics as $assessment_rubric) {
                Score::create([
                    'assessment_id' => 2,
                    'group_id' => 2,
                    'user_id' => $member,
                    'assessment_rubric_id' => $assessment_rubric,
                    'given_by' => $member,
                    'score' => rand(10, 25)
                ]);

                // Randomly skip some scores to simulate incomplete assessments
                if (rand(0, 1)) {
                    foreach (array_diff($group2_members, [$member]) as $other_member) {
                        Score::create([
                            'assessment_id' => 2,
                            'group_id' => 2,
                            'user_id' => $other_member,
                            'assessment_rubric_id' => $assessment_rubric,
                            'given_by' => $member,
                            'score' => rand(10, 25)
                        ]);
                    }
                }
            }
        }
    }
}