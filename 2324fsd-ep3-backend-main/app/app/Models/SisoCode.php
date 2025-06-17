<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SisoCode extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'description'];

    public function books()
    {
        return $this->hasMany(Book::class, 'siso_code', 'siso_code');
    }

}