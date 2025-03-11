<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => 'required|string|max:255', // Bắt buộc, phải là chuỗi, tối đa 255 ký tự
            'email' => 'required|email|string|max:1000', // Bắt buộc, phải là email, tối đa 1000 ký tự
            'list_id' => 'required', // Bắt buộc, phải là chuỗi, tối đa 255 ký tự
        ];
    }

    /**
     * Custom messages for validation errors.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'required' => ':attribute bắt buộc phải nhập',
            'max' => ':attribute không vượt quá :max ký tự',
            'email' => ':attribute phải là một email hợp lệ',
        ];
    }

    /**
     * Custom attribute names for validation error messages.
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'full_name' => 'Tên đầy đủ', // Thêm vào nếu bạn muốn đổi tên thuộc tính trong thông báo lỗi
            'email' => 'Email',
            'List_id' => 'Danh Sách'
        ];
    }
}
