<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Address;  // Thêm class Address
use App\Models\Campaign; // Đảm bảo bạn import model Campaign
use Illuminate\Contracts\Queue\ShouldQueue;  // Thêm interface này
use Illuminate\Queue\SerializesModels;

class CampaignEmail extends Mailable implements ShouldQueue
{
    use SerializesModels;

    public $campaignId;
    public $senderEmail;
    public $campaignContent;
    public $replyToEmail;
    public $emailFrom;
    public $senderName;
    public $subject;

    /**
     * Constructor nhận campaignId và senderEmail.
     */
    public function __construct($campaignId, $senderEmail)
    {
        $this->campaignId = $campaignId;
        $this->senderEmail = $senderEmail;

        // Truy vấn campaign từ database và lấy nội dung content
        $campaign = Campaign::findOrFail($campaignId);
        $this->campaignContent = $campaign->content;  // Gán nội dung vào biến campaignContent
        $this->replyToEmail = $campaign->email_reply_to;
        $this->emailFrom = $campaign->email_from;
        $this->senderName = $campaign->sender_name;
        $this->subject = $campaign->subject;
    }

    /**
     * Định nghĩa thông tin người gửi và tiêu đề email.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->senderEmail, $this->senderName),
            subject: $this->subject,
            replyTo: $this->replyToEmail,  // Thiết lập replyTo nếu có
        );
    }

    /**
     * Nội dung của email.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.campaign',
            with: [
                'campaignId' => $this->campaignId,
                'campaignContent' => $this->campaignContent,  // Truyền campaignContent vào view
            ],
        );
    }
}
