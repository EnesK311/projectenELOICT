<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionsSeeder extends Seeder
{
    public function run()
    {
        DB::table('regions')->insert([
            [
                'id' => 25,
                'status' => true,
                'name' => 'Gent',
                'code' => 'GNT',
                'province_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}