<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\User;

class ImageController extends BaseApiController
{

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    public function store(Request $request)
    {
        // return $request->all();
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
            $filename = $request->uid . '.' . $request->file('file')->getClientOriginalExtension();
            $imgSaved = Storage::disk('cloudinary')->putFileAs($request->path, $request->file('file'), $filename);
            // Update only the image column in the users table
            $imgUpdate = (object)[];
            if ($imgSaved && $request->path == 'companies') {
                $imgUpdate = User::where('uuid', $request->uid)->update(['image' => $request->path . '/' . $filename]);
            } elseif ($imgSaved &&  $request->path == 'companies') {
                $imgUpdate = Company::where('uuid', $request->uid)->update(['image' => $request->path . '/' . $filename]);
            }
            // $imgSaved = Storage::disk('local')->putFileAs($request->path, $request->file('file'),$filename);
            return $imgSaved && $imgUpdate ? $this->sendResponse($request->path . '/' . $filename, 'Image updated successfully.') : $this->sendError('something Went Wrong');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for role name.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
        }
    }

}
