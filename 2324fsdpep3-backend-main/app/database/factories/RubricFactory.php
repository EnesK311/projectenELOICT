<?php

namespace Database\Factories;

use App\Models\Rubric;
use Illuminate\Database\Eloquent\Factories\Factory;

class RubricFactory extends Factory
{
    protected $model = Rubric::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word, // Generates a random word for the name
            'is_fixed' => $this->faker->boolean, // Generates either true or false
        ];
    }
}