<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->boolean('status');
            $table->string('name');
            $table->string('location');
            $table->string('address');
            $table->string('phone1')->nullable(); // Added phone1 column
            $table->string('phone2')->nullable(); // Added phone2 column
            $table->string('email')->nullable(); // Added email column
            $table->double('lat', 10, 7); // Adjusted lat to double for coordinates
            $table->double('lng', 10, 7); // Adjusted lng to double for coordinates
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('locations');
    }
};