<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\CampaignEmail;
use App\Models\Campaign;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


class SendCampaignEmails extends Command
{
    protected $signature = 'campaign:send-emails';
    protected $description = 'Send campaign emails to all contacts at scheduled time';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
         // Lấy email người gửi từ cột email_from trong bảng campaigns
        $senderEmail = env('MAIL_FROM_ADDRESS'); 

        // Lấy chiến dịch mà bạn muốn (hoặc có thể là tất cả các chiến dịch)
        $campaigns = Campaign::with('contactList.contacts')
                ->where('scheduled_at', '<', Carbon::now()) // scheduled_at < now()
                ->whereNull('sent_at') // sent_at == null
                ->get();
                
        foreach ($campaigns as $campaign) {

            // Kiểm tra nếu campaign có contactList và contactList có contacts
        if ($campaign->contactList && $campaign->contactList->contacts->isNotEmpty()) {
            $contacts = $campaign->contactList->contacts;

            // Lặp qua danh sách contacts để gửi email
            foreach ($contacts as $contact) {
                try {
                    // Sử dụng Queue để gửi email
                    // Mail::to($contact->email)
                    //     ->queue(new CampaignEmail($campaign->id, $senderEmail));

                    Log::info('Queued email for ' .$campaign->id. $contact->email); // Log địa chỉ email đã được gửi

                } catch (\Exception $e) {
                    // Nếu có lỗi xảy ra, ghi lại lỗi
                    Log::error("Failed to queue email for " . $contact->email . ": " . $e->getMessage());
                }
            }
            // Đánh dấu chiến dịch là đã gửi
            $campaign->sent_at = now();
            $campaign->save();
            }else {
                Log::warning('Campaign ID ' . $campaign->id . ' has no contacts.');
            }
        }
    }
}
