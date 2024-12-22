<?php

namespace App\Http\Controllers;

use App\Models\EmailTemplate;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        
        $q = $request->query('q'); // Từ khóa tìm kiếm
        $limit = $request->query('limit', 12); // Số lượng mục trên mỗi trang, mặc định là 5
    
        // Tối ưu hóa truy vấn với 'when' và 'latest'
        $campaigns = EmailTemplate:: when($q, function ($query, $q) {
                // Tìm kiếm theo từ khóa trong các cột name hoặc updated_at
                return $query->where(function ($query) use ($q) {
                    $query->where('name', 'like', '%' . $q . '%');
                });
            })
            ->latest(); // Sắp xếp theo mới nhất
    
        // Phân trang kết quả
        $templates = $campaigns->paginate($limit);
    
        // Xử lý khi không có kết quả
        if ($templates->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No campaigns found matching the search criteria',
            ], 404);
        }
    
        // Trả về danh sách chiến dịch
        return response()->json([
            'success' => true,
            'data' => $templates,
            'message' => 'Campaigns retrieved successfully',
        ]);
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $email = EmailTemplate::find($id);
        if(!$email){

            return response()->json([
                'success' => false,
                'massage' => 'email not found'
            ],
            404
            );
        }
        return response()->json([
            'success' => true,
            'data' => $email,
            'massage' => 'email retrieved successfully'
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EmailTemplate $emailTemplate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmailTemplate $emailTemplate)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmailTemplate $emailTemplate)
    {
        //
    }
}
