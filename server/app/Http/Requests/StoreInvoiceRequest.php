<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvoiceRequest extends FormRequest
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
            'code' => 'required|string|max:255|unique:invoices',
            'receipt_id' => 'required|exists:receipts,id',
            'user_id' => 'required|exists:users,id',
            'dp' => 'required|numeric',
            'amount' => 'required|numeric',
            'finished_at' => 'required|date',
        ];
    }
}
