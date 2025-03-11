<?php

namespace App\Services;

use NeverBounce\Auth;
use NeverBounce\Single;

class NeverBounceService
{
    public function __construct()
    {
        // Thiết lập API Key từ .env
        Auth::setApiKey(env('NEVERBOUNCE_API_KEY'));
    }

    /**
     * Kiểm tra email thông qua NeverBounce.
     *
     * @param string $email
     * @return array
     */
    public function validateEmail(string $email): array
    {
        try {
            // Xác minh email với NeverBounce
            $result = Single::check($email);

            return [
                'email' => $email,
                'result' => $result->result, // Trạng thái: valid, invalid, disposable, catchall, unknown
                'status' => $this->mapStatus($result->result),
            ];
        } catch (\Exception $e) {
            return [
                'email' => $email,
                'result' => 'error',
                'status' => 'Error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Mapping trạng thái trả về từ NeverBounce.
     *
     * @param string $result
     * @return string
     */
    private function mapStatus(string $result): string
    {
        switch ($result) {
            case 'valid':
                return 'Email is valid and deliverable.';
            case 'invalid':
                return 'Email is invalid.';
            case 'disposable':
                return 'Email is disposable.';
            case 'catchall':
                return 'Email domain accepts all emails, cannot confirm individual address.';
            case 'unknown':
                return 'Could not verify email.';
            default:
                return 'Unknown result.';
        }
    }
}
