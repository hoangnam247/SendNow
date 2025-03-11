<?php

namespace App\Policies;

use App\Models\ContactList;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ContactListPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Tất cả người dùng được phép xem danh sách
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ContactList $contactList): bool
    {
        // Chỉ cho phép người dùng sở hữu danh sách liên hệ xem
        return $user->id === $contactList->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user,ContactList $contactList): bool
    {
        // Chỉ người dùng sở hữu danh sách liên hệ được phép tạo
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ContactList $contactList): bool
    {
        // Chỉ người dùng sở hữu danh sách liên hệ được phép cập nhật
        return $user->id === $contactList->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ContactList $contactList): bool
    {
        // Chỉ người dùng sở hữu danh sách liên hệ được phép xóa
        return $user->id === $contactList->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ContactList $contactList): bool
    {
        // Chỉ người dùng sở hữu danh sách liên hệ được phép khôi phục
        return $user->id === $contactList->user_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ContactList $contactList): bool
    {
        // Ví dụ: Chỉ người dùng  được phép xóa vĩnh viễn
        return $user->id === $contactList->user_id;
    }
}
