<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Habit extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'type', 'target_value', 'unit', 'icon'];

    public function logs()
    {
        return $this->hasMany(HabitLog::class);
    }
}
