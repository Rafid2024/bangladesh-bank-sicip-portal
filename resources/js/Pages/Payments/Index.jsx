import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import {
    CreditCard,
    DollarSign,
    CheckCircle2,
    Clock,
    Plus,
    ShieldCheck,
    Send,
    Radio
} from 'lucide-react';
import AppLayout from '../../Layouts/AppLayout';
import BentoCard from '../../Components/Common/BentoCard';
import Badge from '../../Components/Common/Badge';
import Button from '../../Components/Common/Button';
import Modal from '../../Components/Common/Modal';
import Input from '../../Components/Common/Input';

export default function Payments({ transactions, gateways = [] }) {
    const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [webhookSuccessMsg, setWebhookSuccessMsg] = useState(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        amount: '1500.00',
        gateway: 'stripe',
    });

    const handleInitiate = (e) => {
        e.preventDefault();
        post('/payments/initiate', {
            onSuccess: () => {
                reset();
                setCheckoutModalOpen(false);
            },
        });
    };

    const handleSimulateWebhook = async (txn) => {
        try {
            const res = await fetch(`/api/webhooks/${txn.gateway}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Signature': 'simulated-hmac-sha256-verified',
                },
                body: JSON.stringify({
                    gateway: txn.gateway,
                    event_id: 'evt_sim_' + Date.now(),
                    event_type: 'payment_intent.succeeded',
                    transaction_ref: txn.transaction_ref,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setWebhookSuccessMsg(`Webhook received for ${txn.transaction_ref}. Status marked as successful with idempotency cache verified!`);
                router.reload();
            }
        } catch (err) {
            alert('Webhook failed: ' + err.message);
        }
    };

    return (
        <AppLayout title="Payment Gateways & Invoices Architecture">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <Badge variant="success" size="md">
                            Multi-Provider Architecture
                        </Badge>
                        <span className="text-xs text-zinc-400">Cryptographic Signature & Idempotency</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                        Enterprise Payment Gateways & Ledger
                    </h1>
                </div>

                <Button variant="primary" size="md" onClick={() => setCheckoutModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Simulate Payment
                </Button>
            </div>

            {/* Webhook Alert */}
            {webhookSuccessMsg && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{webhookSuccessMsg}</span>
                    </div>
                    <button onClick={() => setWebhookSuccessMsg(null)} className="text-zinc-400 hover:text-white">✕</button>
                </div>
            )}

            {/* Multi-Provider Gateway Bento Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {gateways.map((g) => (
                    <div
                        key={g}
                        className="bento-tile rounded-2xl p-5 bg-[#1f1f23] flex items-center justify-between"
                    >
                        <div>
                            <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Provider Gateway</span>
                            <h4 className="text-sm font-bold text-white capitalize mt-0.5">{g}</h4>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Interface Active
                            </span>
                        </div>
                        <CreditCard className="w-6 h-6 text-indigo-400/80" />
                    </div>
                ))}
            </div>

            {/* Transaction Ledger Table */}
            <div className="bento-tile rounded-3xl overflow-hidden bg-[#1f1f23]">
                <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-tight">
                            Payment Transactions & Invoices Ledger
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Real-time reconciliation with idempotency key caching.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider">
                                <th className="p-4">Transaction Ref</th>
                                <th className="p-4">Gateway</th>
                                <th className="p-4">Client User</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Webhook Simulation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {transactions.data.map((txn) => (
                                <tr key={txn.id} className="hover:bg-zinc-800/40 transition">
                                    <td className="p-4 font-mono font-bold text-indigo-400">
                                        {txn.transaction_ref}
                                    </td>
                                    <td className="p-4 font-semibold text-white capitalize">
                                        {txn.gateway}
                                    </td>
                                    <td className="p-4 text-zinc-200 font-medium">
                                        {txn.user?.name || 'Customer'}
                                    </td>
                                    <td className="p-4 font-mono font-bold text-white">
                                        ${Number(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {txn.currency}
                                    </td>
                                    <td className="p-4">
                                        <Badge
                                            variant={
                                                txn.status === 'successful'
                                                    ? 'success'
                                                    : txn.status === 'pending'
                                                    ? 'warning'
                                                    : 'danger'
                                            }
                                            size="sm"
                                        >
                                            {txn.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-zinc-400 text-[11px] font-mono">
                                        {new Date(txn.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {txn.status === 'pending' ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSimulateWebhook(txn)}
                                                className="py-1 px-2.5 text-[11px]"
                                            >
                                                <Radio className="w-3 h-3 mr-1 text-emerald-400" />
                                                Trigger Webhook
                                            </Button>
                                        ) : (
                                            <span className="text-[11px] text-emerald-400 font-medium">
                                                Reconciled ✓
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Initiate Payment Modal */}
            <Modal
                isOpen={checkoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                title="Initiate Multi-Provider Checkout"
                description="Simulate creating a payment transaction using PaymentGatewayInterface."
            >
                <form onSubmit={handleInitiate} className="space-y-4">
                    <Input
                        label="Amount ($ USD)"
                        type="number"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        error={errors.amount}
                        required
                    />

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
                            Choose Gateway Provider
                        </label>
                        <select
                            value={data.gateway}
                            onChange={(e) => setData('gateway', e.target.value)}
                            className="w-full bg-[#18181B] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500"
                        >
                            {gateways.map((g) => (
                                <option key={g} value={g}>{g.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={() => setCheckoutModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            loading={processing}
                        >
                            Create Transaction
                        </Button>
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}

