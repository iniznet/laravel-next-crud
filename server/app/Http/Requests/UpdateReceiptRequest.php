<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReceiptRequest extends FormRequest
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
            'code' => 'string|max:6|unique:receipts',
            'customer_id' => 'exists:users,id',
            'receiver_id' => 'exists:users,id',
            'technician_id' => 'exists:users,id',
            'items' => 'array',
            'items.*.receipt_id' => 'exists:receipts,id',
        ];
    }
}
