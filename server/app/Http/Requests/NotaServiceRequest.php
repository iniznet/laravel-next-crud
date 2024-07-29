<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotaServiceRequest extends FormRequest
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
            'STATUS' => 'required|integer',
            'FAKTUR' => 'required|string|max:50',
            'KODE' => 'required|string|max:20',
            'TGL' => 'required|date',
            'TGLBAYAR' => 'required|date',
            'PEMILIK' => 'required|string|max:50',
            'NOTELEPON' => 'required|string|max:50',
            'ESTIMASISELESAI' => 'required|date',
            'ESTIMASIHARGA' => 'required|numeric',
            'HARGA' => 'required|numeric',
            'NOMINALBAYAR' => 'required|numeric',
            'DP' => 'required|numeric',
            'PENERIMA' => 'required|string|max:50',
            'DATETIME' => 'required|date',
            'USERNAME' => 'required|string|max:50',
        ];
    }
}
