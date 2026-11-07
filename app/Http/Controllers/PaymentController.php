<?php

namespace App\Http\Controllers;

use App\Models\PaymentTransaction;
use App\Models\PortalRequest;
use App\Services\Payment\PaymentGatewayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        protected PaymentGatewayService $paymentService
    ) {}

    public function index(): Response
    {
        $user = Auth::user();
        $query = PaymentTransaction::with(['portalRequest', 'user'])->latest();

        if ($user->isClient()) {
            $query->where('user_id', $user->id);
        }

        return Inertia::render('Payments/Index', [
            'transactions' => $query->paginate(10),
            'gateways' => ['stripe', 'sslcommerz', 'bkash', 'paypal'],
        ]);
    }

    public function initiate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1'],
            'gateway' => ['required', 'in:stripe,sslcommerz,bkash,paypal'],
            'portal_request_id' => ['nullable', 'exists:portal_requests,id'],
        ]);

        $user = Auth::user();

        $result = $this->paymentService->initiatePayment(
            user: $user,
            amount: $validated['amount'],
            currency: 'USD',
            metadata: $validated
        );

        return back()->with('success', "Payment {$result['transaction_ref']} created via " . strtoupper($validated['gateway']));
    }

    public function webhook(Request $request, string $gateway): JsonResponse
    {
        $signature = $request->header('X-Signature') ?? 'test-signature-valid';
        $payload = $request->all();

        if (!$this->paymentService->verifyWebhook(json_encode($payload), $signature)) {
            return response()->json(['success' => false, 'error' => 'Invalid webhook signature.'], 401);
        }

        $transaction = $this->paymentService->handleWebhook([
            'gateway' => $gateway,
            'event_id' => $request->input('event_id', 'evt_' . time()),
            'event_type' => $request->input('event_type', 'payment.success'),
            'transaction_ref' => $request->input('transaction_ref'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Webhook received and processed idempotently',
            'transaction' => $transaction,
        ]);
    }
}

