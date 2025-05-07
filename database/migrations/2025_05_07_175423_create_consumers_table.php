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
        Schema::create('consumers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('user_uuid')->unique();
            $table->string('consumer_contact')->nullable();
            $table->string('consumer_email')->nullable();
            $table->string('supplier_uids');
            $table->string('consumer_remarks')->nullable();
            $table->string('supplier_remarks')->nullable();
            $table->timestamps();
            $table->foreign('user_uuid')->references('uuid')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumers');
    }
};
