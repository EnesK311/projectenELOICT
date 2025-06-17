<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $notifications = [
            ['user_id' => 1, 'assessment_id' => 1], // John Doe
            ['user_id' => 2, 'assessment_id' => 1], // Jane Smith
            ['user_id' => 3, 'assessment_id' => 1], // Alice Johnson
            ['user_id' => 4, 'assessment_id' => 1], // Bob Brown
            ['user_id' => 5, 'assessment_id' => 1], // Charlie Davis
            ['user_id' => 6, 'assessment_id' => 2], // Eve Miller
            ['user_id' => 7, 'assessment_id' => 2], // Frank Wilson
            ['user_id' => 8, 'assessment_id' => 2], // Grace Taylor
            ['user_id' => 9, 'assessment_id' => 2], // Henry Anderson
            ['user_id' => 10, 'assessment_id' => 2], // Ivy Thomas
        ];

        foreach ($notifications as $notification) {
            Notification::create($notification);
        }
    }
}