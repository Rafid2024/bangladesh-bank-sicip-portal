<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortalRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'category' => ['sometimes', 'required', 'string'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high,critical'],
            'budget_estimate' => ['nullable', 'numeric', 'min:0'],
            'assigned_manager_id' => ['nullable', 'exists:users,id'],
            'tags' => ['nullable', 'array'],
        ];
    }
}

