<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePortalRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'category' => ['required', 'string'],
            'priority' => ['required', 'in:low,medium,high,critical'],
            'budget_estimate' => ['nullable', 'numeric', 'min:0'],
            'sla_due_at' => ['nullable', 'date', 'after:now'],
            'tags' => ['nullable', 'array'],
        ];
    }
}

