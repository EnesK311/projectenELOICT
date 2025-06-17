<?php

// database/seeders/HomepageTextSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HomepageText;

class HomepageTextSeeder extends Seeder
{
    public function run()
    {
        // Hero Section
        HomepageText::create([
            'section' => 'hero_title',
            'content' => 'Welcome to Peer Evaluations',
        ]);

        HomepageText::create([
            'section' => 'hero_subtitle',
            'content' => 'Enhance your team’s performance with our peer evaluation platform.',
        ]);

        // Features Section
        HomepageText::create([
            'section' => 'feature_1_title',
            'content' => 'Easy to Use',
        ]);

        HomepageText::create([
            'section' => 'feature_1_description',
            'content' => 'Our platform is designed to be intuitive and user-friendly.',
        ]);

        HomepageText::create([
            'section' => 'feature_2_title',
            'content' => 'Comprehensive Reports',
        ]);

        HomepageText::create([
            'section' => 'feature_2_description',
            'content' => 'Get detailed insights into your team’s performance.',
        ]);

        HomepageText::create([
            'section' => 'feature_3_title',
            'content' => 'Secure and Private',
        ]);

        HomepageText::create([
            'section' => 'feature_3_description',
            'content' => 'We prioritize your data security and privacy.',
        ]);
    }
}