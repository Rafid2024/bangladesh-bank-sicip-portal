<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransitionWorkflowRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'to_status' => ['required', 'string', 'in:draft,pending_review,approved,rejected,in_progress,completed,cancelled'],
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}

