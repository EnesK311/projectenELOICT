<?php

namespace App\Http\Controllers;

use App\Models\HomepageText;
use Illuminate\Http\Request;

class HomepageTextController extends Controller
{
    // Get all homepage texts
    public function index()
    {
        return response()->json(HomepageText::all());
    }

    // Update a specific section
    public function update(Request $request, $id)
    {
        //check if admin
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'content' => 'required|string',
        ]);

        $homepageText = HomepageText::findOrFail($id);
        $homepageText->update([
            'content' => $request->content,
        ]);

        return response()->json(['message' => 'Homepage text updated successfully']);
    }
}