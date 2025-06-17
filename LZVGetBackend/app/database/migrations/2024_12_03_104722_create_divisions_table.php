<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->integer('top');
            $table->integer('bot');
            $table->unsignedBigInteger('region_id');
            $table->unsignedBigInteger('alternate_division_id')->nullable();
            $table->unsignedBigInteger('season_id');
            $table->timestamps();

            $table->foreign('region_id')->references('id')->on('regions')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('divisions');
    }
};