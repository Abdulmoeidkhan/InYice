<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Models\ImageCollection;





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
    // public function store(Request $request)
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'file' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return $this->sendError('Validation Error.', $validator->errors());
            }

            // Check if the file is present in the request
            if (!$request->hasFile('file')) {
                return $this->sendError('File not found in the request.');
            }

            // Store the image in Cloudinary
            $filename = $request->uid.'.'.$request->file('file')->getClientOriginalExtension();
            $imgSaved = Storage::disk('cloudinary')->putFileAs($request->path, $request->file('file'),$filename);
            $imgDataUpdate = $imgSaved ? ImageCollection::updateOrCreate(
                [
                    'assoc_uuid' => $filename,
                    'belongs_to' => $request->path.'-'.$filename,
                    'path' => $request->path.'/'.$filename,
                ],
            ) : null;
            // $imgSaved = Storage::disk('local')->putFileAs($request->path, $request->file('file'),$filename);
            return $imgSaved ? $this->sendResponse($request->path.'/'.$filename, 'Image updated successfully.') : $this->sendError('something Went Wrong');
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
