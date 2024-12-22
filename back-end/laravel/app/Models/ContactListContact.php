<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactListContact extends Model
{
    use HasFactory;

    protected $table = 'contact_list_contacts';
    protected $fillable = [ 'contact_list_id','contact_id','created_at','updated_at'];

    // // Quan hệ belongsTo với ContactList
    // public function contactList()
    // {
    //     return $this->belongsTo(ContactList::class, 'contact_list_id');
    // }

    // // Quan hệ belongsTo với Contact
    // public function contact()
    // {
    //     return $this->belongsTo(Contact::class, 'contact_id');
    // }
}
