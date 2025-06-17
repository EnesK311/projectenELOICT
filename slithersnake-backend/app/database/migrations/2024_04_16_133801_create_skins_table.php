<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('image_head');
            $table->text('image_body');
            $table->boolean('featured')->nullable();
            $table->text('unlock_condition')->nullable();
            $table->integer('unlock_value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skins');
    }
};
