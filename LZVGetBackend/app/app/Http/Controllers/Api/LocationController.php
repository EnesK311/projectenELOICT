<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        return Location::all();
    }

    public function show($id)
    {
        return Location::findOrFail($id);
    }

    public function results($id)
    {
        $location = Location::with('results')->findOrFail($id);
        return $location->results;
    }
}