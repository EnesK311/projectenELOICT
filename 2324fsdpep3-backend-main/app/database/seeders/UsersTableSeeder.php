<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        // Admin
        User::create([
            'email' => 'admin@odisee.be',
            'password' => Hash::make('Azerty123'),
            'firstname' => 'Admin',
            'lastname' => 'User',
            'role' => 'admin'
        ]);

        // Teachers
        User::create([
            'email' => 'teacher1@odisee.be',
            'password' => Hash::make('Azerty123'),
            'firstname' => 'Albert',
            'lastname' => 'Einstein',
            'role' => 'teacher'
        ]);

        // Students
        $students = [
            ['email' => 'student1@student.odisee.be', 'firstname' => 'John', 'lastname' => 'Doe'],
            ['email' => 'student2@student.odisee.be', 'firstname' => 'Jane', 'lastname' => 'Smith'],
            ['email' => 'student3@student.odisee.be', 'firstname' => 'Alice', 'lastname' => 'Johnson'],
            ['email' => 'student4@student.odisee.be', 'firstname' => 'Bob', 'lastname' => 'Brown'],
            ['email' => 'student5@student.odisee.be', 'firstname' => 'Charlie', 'lastname' => 'Davis'],
            ['email' => 'student6@student.odisee.be', 'firstname' => 'Eve', 'lastname' => 'Miller'],
            ['email' => 'student7@student.odisee.be', 'firstname' => 'Frank', 'lastname' => 'Wilson'],
            ['email' => 'student8@student.odisee.be', 'firstname' => 'Grace', 'lastname' => 'Taylor'],
            ['email' => 'student9@student.odisee.be', 'firstname' => 'Henry', 'lastname' => 'Anderson'],
            ['email' => 'student10@student.odisee.be', 'firstname' => 'Ivy', 'lastname' => 'Thomas'],
        ];

        foreach ($students as $student) {
            User::create([
                'email' => $student['email'],
                'password' => Hash::make('Azerty123'),
                'firstname' => $student['firstname'],
                'lastname' => $student['lastname'],
                'role' => 'student'
            ]);
        }
    }
}