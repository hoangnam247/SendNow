<?php

namespace App\Http\Controllers;

use App\Mail\CampaignEmail;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CampaignEmailController extends Controller
{
    public function sendCampaignEmail(Request $request)
        {
    // Lấy campaignId từ request
    $campaignId = $request->campaign_id;

    // Tìm campaign và eager load contactLists và contacts
    $campaign = Campaign::with('contactList.contacts')->find($campaignId);

    // Kiểm tra xem campaign có tồn tại và có liên kết với contactList không
    if (!$campaign || !$campaign->contactList) {
        return response()->json(['message' => 'No Contact List found for this campaign.'], 404);
    }

    // Lấy danh sách contacts từ contactList của campaign
    $contacts = $campaign->contactList->contacts;

    if ($contacts->isEmpty()) {
        return response()->json(['message' => 'No contacts found in the Contact List.'], 404);
    }

    // Tiến hành gửi email cho các contacts
    $senderEmail = env('MAIL_FROM_ADDRESS');

    foreach ($contacts as $contact) {
        try {
            Log::info('Sending email to: ' . $contact->email); // Log chỉ email của contact

            // Gửi email vào queue
            Mail::to($contact->email)
                ->queue(new CampaignEmail($campaignId, $senderEmail));
        } catch (\Exception $e) {
            Log::error('Failed to send email to ' . $contact->email . ': ' . $e->getMessage());
            // Nếu gửi thất bại, bạn vẫn có thể tiếp tục gửi cho các contact khác
        }
    }

    return response()->json(['message' => 'Campaign emails sent successfully!']);

    }


    public function uploadImage(Request $request)
    {
        $path = $request->file('image')->store('images');

        return response()->json([

            'path' =>  "https://s3-hcm5-r1.longvan.net/emailmarketing/$path",
            'msg' => 'success',
        ]);

    }
    //

}


