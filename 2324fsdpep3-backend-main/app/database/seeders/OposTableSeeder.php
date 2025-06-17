<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Opo;

class OposTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Opo::create(['name' => 'Software Engineering']);
        Opo::create(['name' => 'Database Systems']);
        Opo::create(['name' => 'Web Development']);
        Opo::create(['name' => 'Data Science']);
        Opo::create(['name' => 'Machine Learning']);
    }
}