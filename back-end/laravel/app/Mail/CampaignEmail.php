<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Address;  // Thêm class Address
use App\Models\Campaign; // Đảm bảo bạn import model Campaign
use Illuminate\Contracts\Queue\ShouldQueue;  // Thêm interface này
use Illuminate\Queue\SerializesModels;
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;
use Illuminate\Support\Facades\Log;

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
    public $cssContent;

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
        $this->cssContent = $campaign->css_content;   // Lấy giá trị css_content từ campaign

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
public function build(): self
{
    // 1. Render view với dữ liệu
    $htmlContent = view('mail.campaign', [
        'content' => $this->campaignContent,
        'css' => $this->cssContent,
    ])->render();

    // 2. Chuẩn bị CSS (có thể kết hợp nhiều nguồn)
    $fullCss = $this->prepareCss();

    // 3. Cấu hình và thực hiện inline CSS
    $htmlWithInlineCss = $this->inlineCss($htmlContent, $fullCss);

    // 4. Gửi email với nội dung đã xử lý
    return $this->html($htmlWithInlineCss)
                ->subject('Campaign Email');
}

protected function prepareCss(): string
{
    $css = $this->cssContent;
  
    return $css;
}

protected function inlineCss(string $html, string $css): string
{
    try {
        $converter = new CssToInlineStyles();
        
        return $converter->convert(
            $html,
            $css,
            [
                'strip_original_style_tags' => false,
                'use_inline_styles_block' => true,
                'exclude_media_queries' => false
            ]
        );
    } catch (\Exception $e) {
        Log::error('CSS inlining failed: '.$e->getMessage());
        return $html;
    }
}
}
