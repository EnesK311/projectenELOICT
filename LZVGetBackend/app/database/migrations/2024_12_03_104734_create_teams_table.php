<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->string('website')->nullable(); // Added website column
            $table->string('shirt_color')->nullable();
            $table->string('shorts_color')->nullable();
            $table->text('team_info')->nullable();
            $table->integer('delay_home_max')->nullable(); // Added delay_home_max column
            $table->integer('delay_days_home_max')->nullable(); // Added delay_days_home_max column
            $table->integer('delay_days_away_max')->nullable(); // Added delay_days_away_max column
            $table->timestamp('last_login_at')->nullable(); // Added last_login_at column
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teams');
    }
};