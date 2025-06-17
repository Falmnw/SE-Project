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
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');             // Kucing / Anjing
            $table->string('breed')->nullable(); // 🆕 Ras hewan, opsional
            $table->string('gender');           // Jantan / Betina
            $table->integer('age');
            $table->string('region')->nullable(); // 🆕 Asal / tempat tinggal
            $table->string('owner_email');      // Email pemilik
            $table->string('image_path')->nullable(); // Path gambar
            $table->timestamps();               // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
