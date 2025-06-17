<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str; // Add this line to import the Str class

class BooksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return
            [
                'id' => $this->id,
                'title' => $this->title,
                'author' => $this->author->getFullNameAttribute(),
                'teaser' => Str::betweenFirst($this->content, 0, 200),
                'publisher' => $this->publisher,
                'available' => $this->available,
                'sisocode' => $this->sisoCode ? $this->sisoCode->siso_code : null, // Correct syntax
                'tags' => $this->tags
            ];
    }
}