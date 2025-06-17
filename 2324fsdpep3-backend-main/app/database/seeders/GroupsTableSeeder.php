<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;

class GroupsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Group::create([
            'title' => 'Group 1',
            'opo_id' => 1, // assuming opo with ID 1 exists
        ]);

        Group::create([
            'title' => 'Group 2',
            'opo_id' => 2, // assuming opo with ID 2 exists
        ]);
    }
}