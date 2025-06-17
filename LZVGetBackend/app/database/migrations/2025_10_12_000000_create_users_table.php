<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('email_verification_token', 64)->nullable();
            $table->timestamp('email_verification_expires_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->enum('role', ['player', 'manager', 'viewer'])->default('player');

            $table->unsignedBigInteger('team_id')->nullable();
            $table->unsignedBigInteger('season_id')->nullable();
            $table->integer('number')->nullable();
            $table->string('nickname')->nullable();
            $table->string('uid')->nullable();
            $table->integer('games')->nullable();
            $table->decimal('avg_against', 8, 2)->nullable(); // Set as decimal for precision
            $table->integer('keeper_games')->nullable();

            $table->integer('goals')->default(0);
            $table->integer('assists')->default(0);

            $table->rememberToken();
            $table->timestamps();


            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};