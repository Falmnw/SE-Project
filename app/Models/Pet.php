<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'name',
        'type',
        'breed',     // 🆕
        'gender',
        'age',
        'region',    // 🆕
        'owner_email',
        'image_path',
    ];
}