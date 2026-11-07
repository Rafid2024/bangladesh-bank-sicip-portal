<?php

namespace App\Services\Payment;

use App\Models\PaymentTransaction;
use App\Models\User;

interface PaymentGatewayInterface
{
    public function initiatePayment(User $user, float $amount, string $currency, array $metadata = []): array;

    public function verifyWebhook(string $payload, string $signatureHeader): bool;

    public function handleWebhook(array $eventPayload): PaymentTransaction;
}

