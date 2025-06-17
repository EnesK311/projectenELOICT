<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title');
            //$table->foreignId('assessment_id')->constrained('assessments');
            $table->foreignId('opo_id')->constrained('opos')->onDelete('cascade');
            $table->timestamps();
        });

        // Pivot table for group members
        Schema::create('group_user', function (Blueprint $table) {
            $table->foreignId('group_id')->constrained('groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->primary(['group_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_user');
        Schema::dropIfExists('groups');
    }
}