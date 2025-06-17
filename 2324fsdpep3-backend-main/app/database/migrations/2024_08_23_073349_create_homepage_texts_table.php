<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHomepageTextsTable extends Migration
{
    public function up()
    {
        Schema::create('homepage_texts', function (Blueprint $table) {
            $table->id();
            $table->string('section');
            $table->text('content');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('homepage_texts');
    }
}