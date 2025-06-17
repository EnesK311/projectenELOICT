<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //only live matches supposed to be here.
        Schema::create('livescores', function (Blueprint $table) {
            //person keeping the score
            $table->foreignId(('user_id'))->constrained()->onDelete('cascade');
            //the match that is live
            $table->foreignId('result_id')->constrained()->onDelete('cascade');
            $table->integer('home_team_score');
            $table->integer('away_team_score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('livescores');
    }
};
