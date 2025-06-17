<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Copy_Customer extends Pivot
{
    use HasFactory;

    protected $fillable = ['copy_id', 'customer_id', 'borrowed_at', 'returned_at'];

    public function copy()
    {
        return $this->belongsTo(Copy::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

}