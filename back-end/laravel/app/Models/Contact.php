<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    protected $fillable = [ 'user_id','email','fullname','created_at','updated_at'];

    // Quan hệ Many-to-Many với ContactList thông qua bảng contact_list_contacts
    public function contactLists()
    {
        return $this->belongsToMany(ContactList::class, 'contact_list_contacts', 'contact_id', 'contact_list_id')
                    ->withTimestamps(); // Ghi lại timestamps cho bảng trung gian
    }
}
