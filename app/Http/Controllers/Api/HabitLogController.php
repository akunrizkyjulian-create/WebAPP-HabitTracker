<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HabitLog;
use Illuminate\Http\Request;

class HabitLogController extends Controller
{
    
    public function store(Request $request)
    {
        $validasi = $request->validate([
            'habit_id' => 'required|exists:habits,id',
            'date' => 'required|date',
            'current_value' => 'nullable|numeric',
            'is_completed' => 'nullable|boolean',
        ]);

        $log = HabitLog::updateOrCreate(
            [
                'habit_id' => $validasi['habit_id'],
                'date' => $validasi['date'],
            ],
            [
                'current_value' => $validasi['current_value'] ?? 0,
                'is_completed' => $validasi['is_completed'] ?? false,
            ]
        );

        return response() ->json($log, 200);
    }

    
}
