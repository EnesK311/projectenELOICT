<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('assessment_id')->constrained('assessments');
            $table->foreignId('group_id')->constrained('groups');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('assessment_rubric_id')->constrained('assessment_rubric');
            $table->foreignId('given_by')->constrained('users');
            $table->integer('score')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};