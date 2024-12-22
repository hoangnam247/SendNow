<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Thêm khóa ngoại cho bảng contact_lists
        Schema::table('contact_lists', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    
        // Thêm khóa ngoại cho bảng contacts (nếu cần)
        Schema::table('contacts', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    
        // Thêm khóa ngoại cho bảng contact_list_contacts
        Schema::table('contact_list_contacts', function (Blueprint $table) {
            $table->foreign('contact_list_id')->references('id')->on('contact_lists')->onDelete('cascade');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');
        });
    }
    
    public function down()
    {
        // Xóa khóa ngoại nếu rollback
        Schema::table('contact_lists', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
    
        Schema::table('contact_list_contacts', function (Blueprint $table) {
            $table->dropForeign(['contact_list_id']);
            $table->dropForeign(['contact_id']);
        });
    }
};
