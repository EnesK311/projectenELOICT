<?php

namespace Database\Seeders;

use App\Models\Map;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Map::create([
            'name' => 'standard',
            'image' => 'http://localhost:8080/storage/map_standaard.png',
        ]);

        Map::create([
            'name' => 'walls',
            'image' => 'http://localhost:8080/storage/map_walls.png',
        ]);

        Map::create([
            'name' => 'teleports',
            'image' => 'http://localhost:8080/storage/map_teleports.png',
        ]);
    }
}
