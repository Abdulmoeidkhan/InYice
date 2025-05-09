<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use App\Models\BusinessKeywords;
use Illuminate\Http\Request;

class BusinessKeywordsController  extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $businessKeywords = BusinessKeywords::all();
        return $this->sendResponse(UserResource::collection($businessKeywords), 'Business Keywords retrieved successfully.');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:business_keywords,name',
            'display_name' => 'string|min:3|unique:business_keywords,display_name',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        } else {
            try {
                $newBusinessKeywords = BusinessKeywords::create($validator->validated());
                return $this->sendResponse($newBusinessKeywords, 'Business Keywords saved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Duplicate entry for Business Keywords name.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BusinessKeywords $businessKeywords)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BusinessKeywords $businessKeywords)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BusinessKeywords $businessKeywords)
    {
        //
    }
}
