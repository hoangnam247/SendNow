<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactList extends Model
{
    use HasFactory;

    protected $table = 'contact_lists';
    protected $fillable = ['user_id', 'list_name', 'description', 'created_at', 'updated_at'];

    protected $hidden = []; // Nếu bạn không muốn ẩn bất cứ thuộc tính nào, để trống hoặc không khai báo thuộc tính này

    // Quan hệ One-to-Many với User
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

  // Mối quan hệ với Contacts (một ContactList có thể có nhiều Contacts)
  public function contacts()
  {
      return $this->belongsToMany(Contact::class, 'contact_list_contacts', 'contact_list_id', 'contact_id');
  }
    // Mối quan hệ với Campaigns (một ContactList có thể có nhiều Campaigns)
    public function campaigns()
    {
        return $this->hasMany(Campaign::class);
    }
}
