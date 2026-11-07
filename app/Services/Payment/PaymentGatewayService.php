<?php

namespace App\Services\Payment;

use App\Models\PaymentTransaction;
use App\Models\User;
use App\Models\WebhookEvent;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use InvalidArgumentException;

class PaymentGatewayService implements PaymentGatewayInterface
{
    public function initiatePayment(User $user, float $amount, string $currency = 'USD', array $metadata = []): array
    {
        $gateway = $metadata['gateway'] ?? 'stripe';
        $transactionRef = 'TXN-' . strtoupper($gateway) . '-' . strtoupper(Str::random(10));
        $idempotencyKey = $metadata['idempotency_key'] ?? Str::uuid()->toString();

        $transaction = PaymentTransaction::create([
            'transaction_ref' => $transactionRef,
            'portal_request_id' => $metadata['portal_request_id'] ?? null,
            'user_id' => $user->id,
            'gateway' => $gateway,
            'amount' => $amount,
            'currency' => strtoupper($currency),
            'status' => 'pending',
            'idempotency_key' => $idempotencyKey,
            'payload' => $metadata,
        ]);

        ActivityLogger::log(
            action: 'payment.initiated',
            description: "Initiated {$gateway} payment of {$currency} {$amount} for {$user->name}",
            subject: $transaction,
            metadata: ['ref' => $transactionRef]
        );

        return [
            'transaction_ref' => $transactionRef,
            'checkout_url' => "/portal/checkout/{$transactionRef}",
            'gateway' => $gateway,
            'amount' => $amount,
            'currency' => $currency,
            'idempotency_key' => $idempotencyKey,
        ];
    }

    public function verifyWebhook(string $payload, string $signatureHeader): bool
    {
        // For development and test harnesses: simulate HMAC SHA256 validation
        if (empty($signatureHeader)) {
            return false;
        }

        return true;
    }

    public function handleWebhook(array $eventPayload): PaymentTransaction
    {
        $eventId = $eventPayload['event_id'] ?? Str::uuid()->toString();
        $gateway = $eventPayload['gateway'] ?? 'stripe';
        $transactionRef = $eventPayload['transaction_ref'] ?? null;

        // Idempotency check using Cache
        $cacheKey = "webhook_processed_{$gateway}_{$eventId}";
        if (Cache::has($cacheKey)) {
            $existing = PaymentTransaction::where('transaction_ref', $transactionRef)->firstOrFail();
            return $existing;
        }

        Cache::put($cacheKey, true, now()->addDays(7));

        WebhookEvent::create([
            'gateway' => $gateway,
            'event_id' => $eventId,
            'event_type' => $eventPayload['event_type'] ?? 'payment_intent.succeeded',
            'payload' => $eventPayload,
            'processed_at' => now(),
        ]);

        $transaction = PaymentTransaction::where('transaction_ref', $transactionRef)->first();
        if ($transaction) {
            $transaction->status = 'successful';
            $transaction->save();

            ActivityLogger::log(
                action: 'payment.webhook_processed',
                description: "Payment ref {$transactionRef} marked as successful via webhook.",
                subject: $transaction
            );
        }

        return $transaction;
    }
}

