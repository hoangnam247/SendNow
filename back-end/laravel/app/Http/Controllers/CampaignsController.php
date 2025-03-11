<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CampaignsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Lấy ID của người dùng hiện tại
        $userId = Auth::id();
        $q = $request->query('q'); // Từ khóa tìm kiếm
        $limit = $request->query('limit', 5); // Số lượng mục trên mỗi trang, mặc định là 5
    
        // Tối ưu hóa truy vấn với 'when' và 'latest'
        $campaigns = Campaign::where('user_id', $userId) // Lọc theo user_id
            ->when($q, function ($query, $q) {
                // Tìm kiếm theo từ khóa trong các cột name hoặc updated_at
                return $query->where(function ($query) use ($q) {
                    $query->where('name', 'like', '%' . $q . '%')
                          ->orWhere('updated_at', 'like', '%' . $q . '%');
                });
            })
            ->latest(); // Sắp xếp theo mới nhất
    
        // Phân trang kết quả
        $paginatedCampaigns = $campaigns->paginate($limit);
    
        // Xử lý khi không có kết quả
        if ($paginatedCampaigns->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No campaigns found matching the search criteria',
            ], 404);
        }
    
        // Trả về danh sách chiến dịch
        return response()->json([
            'success' => true,
            'data' => $paginatedCampaigns,
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
        // Tạo chiến dịch mới với giá trị mặc định
        $campaign = Campaign::create([
            'name' => $request->input('name', 'Chiến dịch chưa được đặt tên'), // Giá trị mặc định
            'user_id' => Auth::id(), // Lấy ID của người dùng hiện tại (đã đăng nhập)
        ]);

        return response()->json([
            'success' => true,
            'data' => $campaign,
            'message' => 'Chiến dịch đã được tạo thành công!',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Campaign $campaign)
    {
        // Lấy ID của người dùng hiện tại
        $userId = Auth::id();
    
        // Kiểm tra nếu chiến dịch không thuộc về người dùng hiện tại
        if ($campaign->user_id !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this campaign'
            ], 403);  // Trả về lỗi 403 Unauthorized
        }
    
        // Trả về dữ liệu chiến dịch nếu tìm thấy và thuộc về người dùng
        return response()->json([
            'success' => true,
            'data' => $campaign,
            'message' => 'Campaign retrieved successfully'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Campaign $campaign)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Campaign $campaign)
    {

        if ($request->has('name')) {
            $campaign->name = $request->input('name');
        }
        if ($request->has('sender_name')) {
            $campaign->sender_name = $request->input('sender_name');
        }
        if ($request->has('subject')) {
            $campaign->subject = $request->input('subject');
        }

        if ($request->has('email_from')) {
            $campaign->email_from = $request->input('email_from');
        }
        if ($request->has('email_reply_to')) {
            $campaign->email_reply_to = $request->input('email_reply_to');
        }
        if ($request->has('contact_list_id')) {
            // Logic to associate campaign with a contact group
            $campaign->contact_list_id = $request->input('contact_list_id');
        }
        if ($request->has('email_template_id')) {
            // Logic to associate campaign with a contact group
            $campaign->email_template_id = $request->input('email_template_id');
        }

        if ($request->has('subject')) {
            // Logic to associate campaign with a contact group
            $campaign->subject = $request->input('subject');
        }
        if ($request->has('content')) {
            // Logic to associate campaign with a contact group
            $campaign->content = $request->input('content');
        }
        if ($request->has('css_content')) {
            // Logic to associate campaign with a contact group
            $campaign->css_content = $request->input('css_content');
        }
        if ($request->has('json_content')) {
            // Logic to associate campaign with a contact group
            $campaign->json_content = $request->input('json_content');
        }
        if ($request->has('scheduled_at')) {
            // Logic to associate campaign with a contact group
            $campaign->scheduled_at = $request->input('scheduled_at');
        }

        // Save the updated campaign
        $campaign->save();

        return response()->json([
            'success' => true,
            'data' => $campaign,
            'message' => 'Campaign updated successfully',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Campaign $campaign)
    {
        //
    }
    public function showWithEmailTemplate(Campaign $campaign)
    {
        // Lấy ID của người dùng hiện tại
        $userId = Auth::id();
    
        // Kiểm tra nếu chiến dịch không thuộc về người dùng hiện tại
        if ($campaign->user_id !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this campaign',
            ], 403);  // Trả về lỗi 403 Unauthorized
        }
    
        // Lấy nội dung từ email_templates nếu tồn tại email_template_id
        $emailTemplateContent = null;
        $emailTemplate_css_content = null;
        $emailTemplate_json_content = null;
        if ($campaign->email_template_id) {
            // Tìm email template dựa trên email_template_id
            $emailTemplate = \App\Models\EmailTemplate::find($campaign->email_template_id);
            if ($emailTemplate) {
                $emailTemplateContent = $emailTemplate->template_content; // Lấy dữ liệu từ cột template_content
                $emailTemplate_css_content = $emailTemplate->template_css_content; // Lấy dữ liệu từ cột template_content
                $emailTemplate_json_content = $emailTemplate->template_json_content; // Lấy dữ liệu từ cột template_content
            }
        }
    
        // Quyết định nội dung hiển thị:
        // Nếu cột content trong campaign trống, hiển thị nội dung từ email_templates
        $finalContent = $campaign->content ?: $emailTemplateContent;
    
        // Trả về dữ liệu chiến dịch cùng nội dung cuối cùng được chọn
        return response()->json([
            'success' => true,
            'data' => [
                'campaign' => $campaign, // Chi tiết chiến dịch
                'email_template_content' => $emailTemplateContent, // Nội dung từ bảng email_templates
                'email_template_css_content' => $emailTemplate_css_content,
                'email_template_json_content' => $emailTemplate_json_content, 
                'final_content' => $finalContent, // Nội dung hiển thị cuối cùng
            ],
            'message' => 'Campaign with email template content retrieved successfully',
        ]);
    }
    


}
