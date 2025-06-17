<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
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
                'author' => new AuthorResource($this->author),
                'publisher' => $this->publisher,
                'content' => $this->content,
                'available' => $this->available,
                'sisocode' => $this->sisoCode ? $this->sisoCode->siso_code : null, // Correct syntax
                'tags' => $this->tags
            ];
    }
}