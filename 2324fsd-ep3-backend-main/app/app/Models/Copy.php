<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Copy extends Model
{
    use HasFactory;

    protected $fillable = ['book_id'];


    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function copy_customers()
    {
        return $this->hasMany(Copy_Customer::class);
    }
}