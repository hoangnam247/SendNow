<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\ContactRequest;
class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(ContactRequest $request)
    {
        try {
            // Tạo danh sách liên hệ với dữ liệu được xác thực
            $validated = $request->validated();
            $validated['user_id'] = $request->user()->id;
                
            // Tạo ContactList
            $contact = Contact::create($validated);
        
            // Chèn vào bảng pivot list_contact_lists
            $listId = $validated['list_id']; // Lấy list_id từ validated


            $contactId = $contact->id; // Lấy id của contact vừa tạo

    
            DB::table('contact_list_contacts')->insert([
                'contact_list_id' => $listId,
                'contact_id' => $contactId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            

            // Trả về phản hồi JSON thành công
            return response()->json([
                'success' => true,
                'data' => $contact,
                'message' => 'Contact  created successfully.',
            ], 201);
        
        } catch (\Exception $e) {
            // Ghi log lỗi để dễ dàng debug
            Log::error('Error creating contact : ' . $e->getMessage());
        
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            // Lấy ID người dùng hiện tại
            $userId = Auth::id();

            // Tìm kiếm Contact thuộc về người dùng hiện tại
            $contact = Contact::where('id', $id)
                                    ->where('user_id', $userId)
                                    ->firstOrFail();

            // Xóa Contact
            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact and all associated contacts deleted successfully.'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Contact not found.'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the Contact.'
            ], 500);
        }
    }

    // Cập nhật trạng thái của liên hệ
    public function updateStatus(Request $request, $id)
    {
        try {
            // Tìm liên hệ theo ID
            $contact = Contact::findOrFail($id);

            // Cập nhật trạng thái
            $contact->update([
                'status' => $request->input('status'),
            ]);

            // Trả về phản hồi thành công
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật trạng thái thành công.',
                'data' => $contact,
            ], 200);
        } catch (\Exception $e) {
            // Trả về lỗi nếu có
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật trạng thái thất bại.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getMonthlyStatistics($id)
    {
        $userId = Auth::id();
        // Kiểm tra xem contact_list có thuộc về user này hay không
        $isOwner = DB::table('contact_lists')
            ->where('id', $id)
            ->where('user_id', $userId) // Chỉ lấy contact_list thuộc về user hiện tại
            ->exists();

        if (!$isOwner) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền truy cập contact_list này',
            ], 403); // Trả về mã lỗi 403 (Forbidden)
        }
         // Lấy ngày hiện tại
         $now = Carbon::now();
         
        // Tìm danh sách các contact_id thuộc contact_list_id thông qua bảng contact_list_contacts
        $contactIds = DB::table('contact_list_contacts')
            ->where('contact_list_id', $id)
            ->pluck('contact_id'); // Lấy danh sách contact_id
    
        // Nếu không tìm thấy contact_id nào, trả về dữ liệu rỗng
        if ($contactIds->isEmpty()) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Không có liên hệ nào thuộc contact_list_id này',
            ]);
        }
    
        // Lấy dữ liệu thống kê liên hệ 4 tháng gần nhất
        $statistics = DB::table('contacts')
            ->select(DB::raw('DATE_FORMAT(created_at, "%m/%Y") as month, COUNT(*) as count'))
            ->whereIn('id', $contactIds) // Chỉ lấy các liên hệ có id trong danh sách contact_id
            ->where('created_at', '>=', $now->subMonths(3)->startOfMonth()) // Lấy dữ liệu từ 4 tháng gần nhất
            ->groupBy(DB::raw('DATE_FORMAT(created_at, "%m/%Y")'))
            ->orderBy(DB::raw('DATE_FORMAT(created_at, "%Y-%m")'), 'asc')
            ->get();
    
        // Trả về kết quả
        return response()->json([
            'success' => true,
            'data' => $statistics,
        ]);
    }
    
}
