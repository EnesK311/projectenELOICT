<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DivisionsSeeder extends Seeder
{
    public function run()
    {
        DB::table('divisions')->insert([
            [
                'id' => 768,
                'name' => '3e Klasse C',
                'code' => '3C',
                'top' => 4,
                'bot' => 2,
                'region_id' => 25,
                'alternate_division_id' => null,
                'season_id' => 2024,
                'created_at' => '2024-08-17 09:45:49',
                'updated_at' => '2024-08-17 09:45:49',
            ],
            [
                'id' => 786,
                'name' => '1e Klasse',
                'code' => '1',
                'top' => 1,
                'bot' => 2,
                'region_id' => 25,
                'alternate_division_id' => null,
                'season_id' => 2024,
                'created_at' => '2024-08-17 14:25:07',
                'updated_at' => '2024-08-17 14:25:07',
            ],
            [
                'id' => 788,
                'name' => '3e Klasse A',
                'code' => '3A',
                'top' => 4,
                'bot' => 2,
                'region_id' => 25,
                'alternate_division_id' => null,
                'season_id' => 2024,
                'created_at' => '2024-08-17 14:25:07',
                'updated_at' => '2024-08-17 14:25:07',
            ],
            [
                'id' => 789,
                'name' => '3e Klasse B',
                'code' => '3B',
                'top' => 4,
                'bot' => 2,
                'region_id' => 25,
                'alternate_division_id' => null,
                'season_id' => 2024,
                'created_at' => '2024-08-17 14:25:07',
                'updated_at' => '2024-08-17 14:25:07',
            ],
        ]);
    }
}