<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index(Request $request)
    {
       $date = $request->query('date', now()->toDateString());

        $habits = Habit::with(['logs' => function ($query) use ($date) {
            $query->where('date', $date);
        }])->get();

        return response()->json($habits);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:progress,checkbox',
            'target_value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        $habit = Habit::create($validated);

        return response()->json($habit, 201);
    }

    public function show($id)
    {
        $habit = Habit::with('logs')->findOrFail($id);

        return response()->json($habit);
    }

    public function update(Request $request, $id)
    {
        $habit = Habit::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:progress,checkbox',
            'target_value' => 'nullable|numeric',
            'unit' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        $habit->update($validated);

        return response()->json($habit);
    }

    public function destroy($id)
    {
        $habit = Habit::findOrFail($id);
        $habit->delete();

        return response()->json(null, 204);
    }
}