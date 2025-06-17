<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(RegionsSeeder::class);
        $this->call(LocationsSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(DivisionsSeeder::class);
        $this->call(ResultsSeeder::class);
        $this->call(PlayersSeeder::class);
    }
}