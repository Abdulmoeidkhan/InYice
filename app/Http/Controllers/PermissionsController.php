<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BaseApiController as BaseApiController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\Permission;

class PermissionsController extends BaseApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permissions = Permission::all();
        return $this->sendResponse(UserResource::collection($permissions), 'Permissions retrieved successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name',
            'display_name' => 'string|min:3|unique:permissions,display_name',
            'description' => 'nullable|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        } else {
            try {
                $newPermission = Permission::create($validator->validated());
                return $this->sendResponse($newPermission, 'Permissions saved successfully.');
            } catch (\Illuminate\Database\QueryException $ex) {
                // Handle specific database errors
                if ($ex->getCode() == 23000) { // Duplicate entry error (unique constraint violation)
                    return $this->sendError('Database Error: Duplicate entry for permissions name.', $ex->getMessage(), 422);
                }

                // General database error
                return $this->sendError('Database Error.', $ex->getMessage());
            }
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $permission = Permission::find($id);

        if (is_null($permission)) {
            return $this->sendError('Permission not found.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:permissions,name,' . $id . ',id',
            'display_name' => 'string|min:3|unique:permissions,display_name,' . $id . ',id',
            'description' => 'nullable|string|min:10',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors(), 422);
        }

        try {
            $permission->update($validator->validated());
            return $this->sendResponse(new UserResource($permission), 'Permission updated successfully.');
        } catch (\Illuminate\Database\QueryException $ex) {
            if ($ex->getCode() == 23000) {
                return $this->sendError('Database Error: Duplicate entry for permissions name.', $ex->getMessage(), 422);
            }
            return $this->sendError('Database Error.', $ex->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $permission = Permission::find($id);

        if (is_null($permission)) {
            return $this->sendError('Permission not found.');
        }

        $permission->delete();

        return $this->sendResponse([], 'Permission deleted successfully.');
    }
}
