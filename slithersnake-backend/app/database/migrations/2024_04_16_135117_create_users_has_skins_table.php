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
        Schema::create('users_has_skins', function (Blueprint $table) {
            $table->foreignId('users_id')->constrained();
            $table->foreignId('skins_id')->constrained();
            $table->primary(['users_id', 'skins_id']);

            $table->dateTime('unlocked_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_has_skins');
    }
};
