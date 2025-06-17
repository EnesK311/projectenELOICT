<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;
use App\Http\Resources\BookResource;
use App\Http\Resources\BooksResource;


class APIController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function books()
    {
        $books = Book::with('author', 'sisocode')->get();
        //velden id title autor object publisher content available from sisocode tags
        return BooksResource::collection($books);
        // Book::with('author', 'sisocode')->get()

    }

    //singular

    public function book(string $id)
    {
        $book = Book::with('author', 'sisocode')->find($id);
        return new BookResource($book);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //validate
        $request->validate([
            'title' => 'required:unique:books',
            'author_id' => 'required:exists:authors,id',
            'publisher' => 'required',
            'siso_code' => 'required',
            'content' => 'required',
        ]);

        $book = Book::create($request->all());
        return new BookResource($book);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}