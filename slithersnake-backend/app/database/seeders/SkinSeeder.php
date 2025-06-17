<?php

namespace Database\Seeders;

use App\Models\Skin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SkinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Skin::create([
            'name' => 'skin 1',
            'image_head' => 'http://localhost:8080/storage/skin1_head.svg',
            'image_body' => 'http://localhost:8080/storage/skin1_body.svg',
            'featured' => 1
        ]);

        Skin::create([
            'name' => 'skin 2',
            'image_head' => 'http://localhost:8080/storage/skin2_head.svg',
            'image_body' => 'http://localhost:8080/storage/skin2_body.svg',
            'featured' => 2
        ]);

        Skin::create([
            'name' => 'skin 3',
            'image_head' => 'http://localhost:8080/storage/skin3_head.svg',
            'image_body' => 'http://localhost:8080/storage/skin3_body.svg',
            'featured' => 3
        ]);

        Skin::create([
            'name' => 'skin 4',
            'image_head' => 'http://localhost:8080/storage/skin4_head.svg',
            'image_body' => 'http://localhost:8080/storage/skin4_body.svg',
            'featured' => 4
        ]);
    }
}
