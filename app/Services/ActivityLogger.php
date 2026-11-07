<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log(
        string $action,
        ?string $description = null,
        mixed $subject = null,
        array $metadata = [],
        ?int $userId = null
    ): ActivityLog {
        $user = Auth::user();
        $finalUserId = $userId ?? $user?->id;

        $subjectType = null;
        $subjectId = null;

        if (is_object($subject) && method_exists($subject, 'getKey')) {
            $subjectType = get_class($subject);
            $subjectId = $subject->getKey();
        } elseif (is_string($subject)) {
            $subjectType = $subject;
        }

        return ActivityLog::create([
            'user_id' => $finalUserId,
            'action' => $action,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'description' => $description,
            'metadata' => array_merge([
                'user_agent' => Request::userAgent(),
                'route' => Request::path(),
            ], $metadata),
            'ip_address' => Request::ip() ?? '127.0.0.1',
        ]);
    }
}

