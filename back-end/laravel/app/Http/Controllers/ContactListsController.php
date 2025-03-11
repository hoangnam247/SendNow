<?php

namespace App\Http\Controllers;

use App\Models\ContactList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ContactListRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class ContactListsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
       
        // Kiểm tra quyền truy cập bằng Policy
        $this->authorize('viewAny', ContactList::class);

        // Lấy thông tin người dùng hiện tại
        $userId = $request->user()->id;

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.',
            ], 403);
        }

        $request->validate([
            'q' => 'nullable|string|max:255',  // Tìm kiếm từ khóa là chuỗi, tối đa 255 ký tự
            'current' => 'nullable|integer|min:1|max:100',  // Giới hạn từ 1 đến 100
            'pageSize' => 'nullable|integer|min:1|max:100',  // Giới hạn từ 1 đến 100
        ]);

        // Lấy từ khóa tìm kiếm từ query string
        $q = $request->query('query');

        // Lấy current (trang hiện tại) và pageSize (số lượng mục mỗi trang) từ query string
        $currentPage = $request->query('current', 1);
        $pageSize = $request->query('pageSize', 5);

        // Tối ưu hóa truy vấn
        $contactLists = ContactList::where('user_id', $userId)
            ->withCount('contacts')
            ->when($q, function ($query, $q) {
                return $query->where('list_name', 'like', '%' . $q . '%');
            })
            ->latest();

        // Phân trang
        $paginatedContactLists = $contactLists->paginate($pageSize, ['*'], 'page', $currentPage);

        if ($paginatedContactLists->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No contact lists found matching the search criteria.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $paginatedContactLists,
            'message' => 'Contact lists retrieved successfully.',
        ], 200);

    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactListRequest $request,)
    {
        try {
            // Tạo danh sách liên hệ với dữ liệu được xác thực
            $validated = $request->validated();
            $validated['user_id'] = $request->user()->id;
                
            // Tạo ContactList
            $contactList = ContactList::create($validated);
        
            // Trả về phản hồi JSON thành công
            return response()->json([
                'success' => true,
                'data' => $contactList,
                'message' => 'Contact list created successfully.',
            ], 201);
        
        } catch (\Exception $e) {
            // Ghi log lỗi để dễ dàng debug
            Log::error('Error creating contact list: ' . $e->getMessage());
        
            // Trả về phản hồi lỗi
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the contact list.',
            ], 500);
        }
        
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactList $list)
    {
        // Lấy ID của người dùng hiện tại
        $userId = Auth::id();
    
        // Truy vấn tất cả các liên hệ thuộc danh sách liên hệ và kiểm tra user_id
        $contacts = $list->contacts()->where('user_id', $userId)->get();

        return response()->json([
            'success' => true,
            'data' => $contacts,
            'message' => 'Contacts retrieved successfully'
        ]);
    }
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactList $contactList)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContactListRequest $request, string $id)
    {
        try {
            // Kiểm tra quyền sửa danh sách liên hệ (Policy)
            $this->authorize('update', ContactList::class);
    
            // Tìm danh sách liên hệ theo ID
            $contactList = ContactList::findOrFail($id);
    
            // Kiểm tra nếu người dùng có quyền sửa danh sách này (chỉ người tạo mới có quyền sửa)
            if ($contactList->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this contact list.',
                ], 403);
            }
    
            // Cập nhật danh sách liên hệ với dữ liệu được xác thực
            $validated = $request->validated();
            $contactList->update($validated);
    
            // Trả về phản hồi JSON thành công
            return response()->json([
                'success' => true,
                'data' => $contactList,
                'message' => 'Contact list updated successfully.',
            ], 200);
    
        } catch (\Exception $e) {
            // Ghi log lỗi để dễ dàng debug
            Log::error('Error updating contact list: ' . $e->getMessage());
    
            // Trả về phản hồi lỗi
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the contact list.',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Lấy ID người dùng hiện tại
            $userId = Auth::id();

            // Tìm kiếm ContactList thuộc về người dùng hiện tại
            $contactList = ContactList::where('id', $id)
                                    ->where('user_id', $userId)
                                    ->firstOrFail();

            // Xóa tất cả liên hệ liên kết với ContactList
            $contactList->contacts()->delete();

            // Xóa ContactList
            $contactList->delete();

            return response()->json([
                'success' => true,
                'message' => 'ContactList and all associated contacts deleted successfully.'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'ContactList not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the ContactList.'
            ], 500);
        }
    }
}
