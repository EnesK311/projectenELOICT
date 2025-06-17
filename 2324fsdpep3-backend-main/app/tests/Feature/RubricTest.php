<?php
// tests/Feature/RubricTest.php

// tests/Feature/RubricTest.php

namespace Tests\Feature;

use App\Models\Rubric;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RubricTest extends TestCase
{
    use RefreshDatabase;

    // Define the user property
    protected $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Initialize the user
        $this->user = User::factory()->create();
    }

    /** @test */
    public function it_can_list_rubrics()
    {
        Rubric::factory()->count(3)->create(['is_fixed' => true]);

        // Authenticate the request
        $response = $this->actingAs($this->user)->getJson('/api/rubrics');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    /** @test */
    public function it_can_create_a_rubric()
    {
        $data = [
            'name' => 'Test Rubric',
            'is_fixed' => true,
        ];

        // Authenticate the request
        $response = $this->actingAs($this->user)->postJson('/api/rubrics', $data);

        $response->assertStatus(201)
            ->assertJsonFragment($data);
    }

    /** @test */
    public function it_can_show_a_rubric()
    {
        $rubric = Rubric::factory()->create(['is_fixed' => true]);

        // Authenticate the request
        $response = $this->actingAs($this->user)->getJson('/api/rubrics/' . $rubric->id);

        $response->assertJsonFragment([
            'name' => $rubric->name,
            'is_fixed' => $rubric->is_fixed ? 1 : 0,
        ]);
    }

    /** @test */
    public function it_can_update_a_rubric()
    {
        $rubric = Rubric::factory()->create();

        $data = [
            'name' => 'Updated Rubric Name',
            'is_fixed' => false,
        ];

        // Authenticate the request
        $response = $this->actingAs($this->user)->putJson('/api/rubrics/' . $rubric->id, $data);

        $response->assertStatus(200)
            ->assertJsonFragment($data);
    }

    /** @test */
    public function it_can_delete_a_rubric()
    {
        $rubric = Rubric::factory()->create();

        // Authenticate the request
        $response = $this->actingAs($this->user)->deleteJson('/api/rubrics/' . $rubric->id);

        $response->assertStatus(204);
    }
}