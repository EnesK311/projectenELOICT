<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'isbn', 'siso_code', 'author_id', 'content'];

    public function author()
    {
        return $this->belongsTo(Author::class);
    }

    public function sisoCode()
    {
        return $this->belongsTo(SisoCode::class, 'siso_code', 'siso_code');
    }

    public function copies()
    {
        return $this->hasMany(Copy::class);
    }

}