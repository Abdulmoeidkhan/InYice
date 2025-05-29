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
        Schema::create('buyers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('user_uuid');
            $table->uuid('seller_uuid');
            $table->uuid('buyer_uuid');
            $table->string('buyer_type');
            $table->timestamps();
            $table->foreign('buyer_uuid')->references('uuid')->on('consumers')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('buyer_uuid')->references('uuid')->on('companies')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('user_uuid')->references('uuid')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('seller_uuid')->references('uuid')->on('companies')
                ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buyers');
    }
};
