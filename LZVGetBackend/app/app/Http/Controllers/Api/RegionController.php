<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Region;

class RegionController extends Controller
{
    public function index()
    {
        return Region::all();
    }

    public function show($id)
    {
        return Region::findOrFail($id);
    }

    public function divisions($id)
    {
        $region = Region::with('divisions')->findOrFail($id);
        return $region->divisions;
    }
}