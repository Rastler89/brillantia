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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('ref_code');
            $table->float('amount')->default(0.0);
            $table->bigInteger('client_id')->unsigned();
            $table->enum('status', ['pending', 'paid', 'partial', 'cancelled', 'refunded', 'failed', 'sended', 'invoiced'])->default('pending');
            $table->bigInteger('user_id')->unsigned();
            $table->enum('payment_method', ['cash', 'card'])->default('card');
            $table->text('notes');
            $table->timestamp('paid_at')->nullable();
            $table->boolean('is_direct');
            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clients');
            $table->foreign('user_id')->references('id')->on('users');
        });

        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sale_id')->unsigned();
            $table->bigInteger('item_id')->unsigned();
            $table->integer('quantity')->default(1);
            $table->float('price')->default(0.0);
            $table->float('amount')->default(0.0);

            $table->foreign('sale_id')->references('id')->on('sales');
            $table->foreign('item_id')->references('id')->on('items');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('sale_items');
        Schema::dropIfExists('sales');
    }
};
