<?php
// app/Models/HomepageText.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomepageText extends Model
{
    protected $fillable = ['section', 'content'];
}