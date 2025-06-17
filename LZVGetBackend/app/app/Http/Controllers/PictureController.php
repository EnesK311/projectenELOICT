<?php

namespace App\Http\Controllers;

use App\Models\Picture;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PictureController extends Controller
{
    public function index($matchId)
    {
        $match = Result::find($matchId);
        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }
        $pictures = $match->pictures()->get()->map(function ($picture) {
            $picture->url = asset('storage/' . $picture->path);
            return $picture;
        });

        return response()->json($pictures);
    }

    public function upload(Request $request, $matchId)
    {
        //get user id
        $userId = auth()->user()->id;

        if (!$userId) {
            return response()->json(['message' => 'User not logged in'], 404);
        }

        Log::info('Upload method called', ['matchId' => $matchId, 'request' => $request->all()]);
        $validator = Validator::make(
            $request->all(),
            [
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:20480', // Example validation - image, up to 20MB
            ],
            [
                'photo.max' => 'The image size must be less than 20MB',
                'photo.mimes' => 'The image must be a valid image',
                'photo.required' => 'Please provide an image to upload'
            ]
        );

        Log::info('Validator initialized', ['validator' => $validator->messages()]);


        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $match = Result::find($matchId);
        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $fileName = Str::random(20) . '.' . $file->getClientOriginalExtension(); // Generate a unique filename
            $path = $file->storeAs('match-images', $fileName, 'public'); // store in the public/match-images directory.

            $picture = new Picture([
                'user_id' => $userId,
                'result_id' => $matchId,
                'path' => $path,
            ]);

            $match->pictures()->save($picture);

            return response()->json(['message' => 'Image uploaded successfully', 'picture' => $picture], 201);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }

}