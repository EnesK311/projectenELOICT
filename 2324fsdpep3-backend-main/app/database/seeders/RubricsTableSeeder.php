<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rubric;

class RubricsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Rubric::create(['name' => 'Communication', 'is_fixed' => true]);
        Rubric::create(['name' => 'Team Contribution', 'is_fixed' => true]);
        Rubric::create(['name' => 'Technical Skills', 'is_fixed' => true]);
        Rubric::create(['name' => 'Problem Solving', 'is_fixed' => true]);
        Rubric::create(['name' => 'Time Management', 'is_fixed' => true]);
    }
}