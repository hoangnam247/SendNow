<?php
namespace App\Jobs;

use App\Mail\CampaignEmail;
use App\Models\Campaign;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendCampaignEmailJob  implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $campaignId;
    protected $senderEmail;

    public function __construct($campaignId, $senderEmail)
    {
        $this->campaignId = $campaignId;
        $this->senderEmail = $senderEmail;
    }

    public function handle()
    {
        // Lấy thông tin campaign
        $campaign = Campaign::findOrFail($this->campaignId);
        $contacts = \App\Models\Contact::whereHas('contactLists', function ($query) use ($campaign) {
            $query->where('contact_list_id', $campaign->contact_list_id);
        })->get();

        // Lấy email người gửi từ cột email_from trong bảng campaigns
        foreach ($contacts as $contact) {
            Mail::to($contact->email)
                ->send(new CampaignEmail($this->campaignId, $this->senderEmail));  // Gửi email cho từng contact
        }
    }
}

