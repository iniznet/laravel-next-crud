<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReceiptRequest extends FormRequest
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
            'code' => 'required|string|max:6|unique:receipts',
            'customer_id' => 'required|exists:users,id',
            'receiver_id' => 'required|exists:users,id',
            'technician_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.receipt_id' => 'required|exists:receipts,id',
        ];
    }
}
