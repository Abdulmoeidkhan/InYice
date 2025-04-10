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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_uuid')->unique();
            $table->uuid('company_uuid')->unique();
            $table->string('company_name')->unique();
            $table->string('company_display_name')->unique();
            $table->string('company_email')->unique();
            $table->string('company_contact')->nullable();
            $table->string('company_industry')->nullable();
            $table->string('company_code')->nullable();
            $table->string('company_address')->nullable();
            $table->string('company_city')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
