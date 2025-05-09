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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('user_uuid')->unique();
            $table->uuid('company_uuid')->nullable();
            $table->string('designation');
            $table->string('email')->unique();
            $table->string('contact')->nullable();
            $table->integer('wage')->default(0);
            $table->integer('status')->default(1);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('remarks')->nullable();
            $table->timestamps();
            $table->foreign('user_uuid')->references('uuid')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('company_uuid')->references('uuid')->on('companies')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
