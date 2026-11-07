<?php

namespace App\Services;

use App\Models\NotificationLog;
use App\Models\PortalRequest;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class NotificationDispatcherService
{
    /**
     * Dispatch multi-channel notifications
     */
    public function send(
        User $user,
        string $title,
        string $message,
        string $channel = 'in_app',
        array $metadata = []
    ): NotificationLog {
        $status = 'sent';
        $recipient = match ($channel) {
            'email' => $user->email,
            'sms', 'whatsapp' => $user->phone ?? $user->email,
            default => 'in-app-stream'
        };

        // Simulate third-party gateway dispatch (Twilio / Resend / UltraMsg)
        Log::info("Dispatching notification [{$channel}] to {$recipient}: {$title}");

        $log = NotificationLog::create([
            'user_id' => $user->id,
            'channel' => $channel,
            'title' => $title,
            'message' => $message,
            'status' => $status,
            'recipient' => $recipient,
            'metadata' => $metadata,
            'read_at' => null,
        ]);

        return $log;
    }

    public function dispatchWorkflowNotification(
        PortalRequest $request,
        string $fromStatus,
        string $toStatus,
        User $actor
    ): void {
        $client = $request->client;
        $title = "Status Update: Request #{$request->tracking_code}";
        $message = "Your request '{$request->title}' has moved from " . strtoupper($fromStatus) . " to " . strtoupper($toStatus) . " by {$actor->name}.";

        // Dispatch In-App
        $this->send($client, $title, $message, 'in_app', [
            'request_id' => $request->id,
            'tracking_code' => $request->tracking_code,
            'actor' => $actor->name,
        ]);

        // Dispatch Email
        $this->send($client, $title, $message, 'email', [
            'request_id' => $request->id,
            'tracking_code' => $request->tracking_code,
        ]);

        // If high or critical priority, dispatch WhatsApp/SMS
        if (in_array($request->priority, ['high', 'critical']) && $client->phone) {
            $this->send($client, $title, $message, 'whatsapp', [
                'request_id' => $request->id,
            ]);
        }
    }
}

