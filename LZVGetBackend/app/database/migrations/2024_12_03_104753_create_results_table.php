<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('results', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary(); // Primary key
            $table->boolean('status')->nullable();
            $table->boolean('notification')->nullable();
            $table->unsignedBigInteger('division_id')->nullable();
            $table->unsignedBigInteger('sportshall_id')->nullable(); // Added this column
            $table->unsignedBigInteger('team1_id')->nullable();
            $table->unsignedBigInteger('team2_id')->nullable();
            $table->integer('score1')->default(0);
            $table->integer('score2')->default(0);
            $table->integer('score3')->nullable();
            $table->integer('score4')->nullable();
            $table->boolean('forfeit')->nullable();
            $table->timestamp('forfeit_at')->nullable();
            $table->timestamp('planned_at')->nullable();
            $table->timestamp('planned_orig_at')->nullable();
            $table->unsignedBigInteger('season_id')->nullable();
            $table->boolean('delayed_request')->nullable();
            $table->boolean('delayed_status')->nullable();
            $table->timestamp('delayed_prop_at')->nullable();
            $table->integer('delayed_prop_count')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('division_id')->references('id')->on('divisions')->onDelete('cascade');
            $table->foreign('sportshall_id')->references('id')->on('locations')->onDelete('cascade'); // For sportshall_id
            $table->foreign('team1_id')->references('id')->on('teams')->onDelete('cascade');
            $table->foreign('team2_id')->references('id')->on('teams')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('results');
    }
};