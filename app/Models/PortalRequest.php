<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortalRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'tracking_code',
        'title',
        'description',
        'category',
        'priority',
        'status',
        'client_id',
        'assigned_manager_id',
        'budget_estimate',
        'metadata',
        'tags',
        'sla_due_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'budget_estimate' => 'decimal:2',
            'metadata' => 'array',
            'tags' => 'array',
            'sla_due_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function assignedManager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_manager_id');
    }

    public function transitions(): HasMany
    {
        return $this->hasMany(WorkflowTransition::class)->latest();
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }
}

