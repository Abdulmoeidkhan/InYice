<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Database\QueryException;

use Illuminate\Http\Request;

class ImageController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ?string $uid, ?string $path)
    {
        return $this->sendResponse('', 'Image updated successfully.');
        $imageBlob = $request->file;
        try {
            // $imgSaved = Storage::disk('cloudinary')->put($path.'/' . $uid, $imageBlob);
            $imgSaved = Storage::disk('cloudinary')->put('image',$imageBlob);
            return $imgSaved ? $this->sendResponse('', 'Image updated successfully.') : $this->sendError('something Went Wrong');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for role name.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
        }
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
