<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GroupMember;

class GroupMembersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Group 1 members for Team Project 1 and 2
        $group1_members = [1, 2, 3, 4, 5];
        foreach ($group1_members as $user_id) {
            GroupMember::create(['group_id' => 1, 'user_id' => $user_id]);
            GroupMember::create(['group_id' => 3, 'user_id' => $user_id]);
        }

        // Group 2 members for Team Project 1 and 2
        $group2_members = [6, 7, 8, 9, 10];
        foreach ($group2_members as $user_id) {
            GroupMember::create(['group_id' => 2, 'user_id' => $user_id]);
            GroupMember::create(['group_id' => 4, 'user_id' => $user_id]);
        }
    }
}