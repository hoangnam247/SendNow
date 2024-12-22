<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactListRequest extends FormRequest
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
            'list_name' => 'required|string|max:255', // Bắt buộc, phải là chuỗi, tối đa 255 ký tự
            'description' => 'nullable|string|max:1000', // Không bắt buộc, phải là chuỗi, tối đa 1000 ký tự
        ];
    }
    public function messages()
    {
        return [
            'required' => ':attribute bắt buộc phải nhập',
            'max' => ':attribute không vượt quá :max ký tự',
        ];
    }

    public function attributes()
    {
        return [
            'list_name' => 'Tên danh sách',
            'description' => 'Mô tả',
        ];
    }
}
