<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    protected $table = 'campaigns';
    
    protected $fillable = ['user_id', 'name', 'sender_name','subject', 'created_at', 'updated_at', 'status','scheduled_at','sent_at', 'contact_list_id'];


    // Quan hệ One-to-Many với User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

 
    // Quan hệ Many-to-Many với ContactList qua bảng contact_list_contacts
    public function contactList()
    {
        return $this->belongsTo(ContactList::class, 'contact_list_id');

    }
}
